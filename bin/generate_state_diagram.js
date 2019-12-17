const events = require('../definitions/appeal/json/CaseEvent');
const fs = require('fs');

const output = { "class": "go.GraphLinksModel",
  "nodeKeyProperty": "id",
  "nodeDataArray": [
    {"id":-1, "loc":`0 -100`, "text":"Start"},
  ],
  "linkDataArray": []
};

const ignoredStates = [ 'ended', 'appealTakenOffline'];
const ignoredEvents = [ 'shareACase' ]; //'sendDirection', 'changeDirectionDueDate', 'addCaseNote', 'recordApplication'];

events.forEach(event => {
  const preConditionStates = event['PreConditionState(s)'];
  const postConditionStates = event['PostConditionState'];
  const eventName = event.ID;

  const preConditionSatesArray = preConditionStates ? preConditionStates.split(';') : [ '[*]' ];

  preConditionSatesArray.forEach(preConditionState => {
    const postConditionState = postConditionStates === '*' ? preConditionState : postConditionStates;

    if (ignoredStates.indexOf(preConditionState) === -1 && ignoredStates.indexOf(postConditionState) === -1) {
      if (ignoredEvents.indexOf(eventName) === -1) {
        output.linkDataArray.push({
          "from": preConditionState,
          "to": postConditionState,
          "text": eventName
        })
      }
    }
  });
});

const combinedLinks = {};

output.linkDataArray.forEach(link => {
  combinedLinks[`${link.from} --> ${link.to}`] = combinedLinks[`${link.from} --> ${link.to}`] ?
    combinedLinks[`${link.from} --> ${link.to}`] + `\\n ${link.text}` :
    link.text;
});

var plantUmlString = '@startuml\n';
plantUmlString += 'hide empty description\n';

Object.keys(combinedLinks).forEach(function (item) {
  plantUmlString += `${item} : ${combinedLinks[item]}\n`;
});
plantUmlString += '@enduml\n';

fs.writeFileSync("target/state_diagram.txt", plantUmlString);
