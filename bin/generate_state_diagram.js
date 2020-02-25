const events = require('../definitions/appeal/json/CaseEvent');
const eventAuthorisations = require('../definitions/appeal/json/AuthorisationCaseEvent');
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
    const postConditionState = postConditionStates === '*' ? preConditionState : postConditionStates;

    if (ignoredStates.indexOf(preConditionState) === -1 && ignoredStates.indexOf(postConditionState) === -1) {
      if (ignoredEvents.indexOf(eventName) === -1) {
        output.push({
          "from": preConditionState,
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

const combinedLinks = {};
outputForRole.forEach(link => {
  combinedLinks[`${link.from} --> ${link.to}`] = combinedLinks[`${link.from} --> ${link.to}`] ?
    combinedLinks[`${link.from} --> ${link.to}`] + `\\n ${link.text}` :
    link.text;
});

var plantUmlString = '@startuml\n';
plantUmlString += 'hide empty description\n';
if (roles.length > 0) {
  plantUmlString += `state "State diagram for ${roles.join(", ")}"\n`; // force this to be a state diagram
}
Object.keys(combinedLinks).forEach(function (item) {
  plantUmlString += `${item} : ${combinedLinks[item]}\n`;
});
plantUmlString += '@enduml\n';

fs.writeFileSync("target/state_diagram.txt", plantUmlString);
