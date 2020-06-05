const events = require('../definitions/appeal/json/CaseEvent');
const eventAuthorisations = require('../definitions/appeal/json/AuthorisationCaseEvent');
const stateAuthorisations = require('../definitions/appeal/json/AuthorisationCaseState');
const fs = require('fs');

const output = [];

const ignoredStates = [ 'ended', 'appealTakenOffline'];
const ignoredEvents = [ 'shareACase' ]; //'sendDirection', 'changeDirectionDueDate', 'addCaseNote', 'recordApplication'];
const roles = process.env.ROLES ? process.env.ROLES.split(',') : [];

events.forEach(event => {
  const preConditionStates = event['PreConditionState(s)'];
  const postConditionStates = event['PostConditionState'];
  const eventName = event.ID;

  const preConditionSatesArray = preConditionStates ? preConditionStates.split(';') : [ '[*]' ];

  preConditionSatesArray.forEach(preConditionState => {
    const newPreConditionState = preConditionState === '*' ? 'allStates' : preConditionState;
    const postConditionState = postConditionStates === '*' ? newPreConditionState : postConditionStates;

    if (ignoredStates.indexOf(newPreConditionState) === -1 && ignoredStates.indexOf(postConditionState) === -1) {
      if (ignoredEvents.indexOf(eventName) === -1) {
        output.push({
          "from": newPreConditionState,
          "to": postConditionState,
          "text": eventName
        })
      }
    }
  });
});

const outputForRole = (roles.length > 0) ? output.filter(event => {
  return event.text === 'start' || eventAuthorisations.some(eventAuthorisation => {
    return eventAuthorisation.CaseEventID === event.text &&
      roles.indexOf(eventAuthorisation.UserRole) >= 0;
  });
}) : output;

const outputNotForRole = (roles.length > 0) ? output.filter(event => {
  return eventAuthorisations.some(eventAuthorisation => {
    return eventAuthorisation.CaseEventID === event.text &&
      roles.indexOf(eventAuthorisation.UserRole) === -1 &&
      outputForRole.indexOf(event) === -1;
  });
}) : [];

const combinedLinks = {};
outputForRole.forEach(link => {
  combinedLinks[`${link.from} --> ${link.to}`] = combinedLinks[`${link.from} --> ${link.to}`] ?
    combinedLinks[`${link.from} --> ${link.to}`] + `\\n ${link.text}` :
    link.text;
});

const combinedLinksNotForRole = {};
outputNotForRole.forEach(link => {
  combinedLinks[`${link.from} --> ${link.to}`] = combinedLinks[`${link.from} --> ${link.to}`] ?
    combinedLinks[`${link.from} --> ${link.to}`] + `\\n <strike>${link.text}</strike>` :
    ` <strike>${link.text}</strike>`;
});

let authorisedStates = [];
let unauthorisedStates = [];
if (roles.length > 0) {
  stateAuthorisations.forEach(stateAuthorisation => {
    if (ignoredStates.indexOf(stateAuthorisation.CaseStateID) === -1) {
      if (roles.indexOf(stateAuthorisation.UserRole) === -1) {
        unauthorisedStates.push(stateAuthorisation.CaseStateID);
      } else {
        authorisedStates.push(stateAuthorisation.CaseStateID);
      }
    }
  });
}

unauthorisedStates = unauthorisedStates.filter(unauthorisedState => authorisedStates.indexOf(unauthorisedState) === -1);
unauthorisedStates = [...new Set(unauthorisedStates)];

var plantUmlString = '@startuml\n';
plantUmlString += 'hide empty description\n';
plantUmlString += 'skinparam state {\n' +
  '  BackgroundColor<<allStates>> DeepSkyBlue\n' +
  '  BackgroundColor<<noPermission>> Gainsboro\n' +
  '  FontColor<<noPermission>> Gray\n' +
  '}\n' +
  'state "All states" as allStates <<allStates>>\n';

unauthorisedStates.forEach(unauthorisedState => plantUmlString += `state ${unauthorisedState} <<noPermission>>\n`);

if (roles.length > 0) {
  plantUmlString += `state "State diagram for ${roles.join(", ")}"\n`; // force this to be a state diagram
}
Object.keys(combinedLinks).forEach(function (item) {
  plantUmlString += `${item} : ${combinedLinks[item]}\n`;
});

Object.keys(combinedLinksNotForRole).forEach(function (item) {
  plantUmlString += `${item} : ${combinedLinksNotForRole[item]}\n`;
});
plantUmlString += '@enduml\n';

fs.writeFileSync("target/state_diagram.txt", plantUmlString);
