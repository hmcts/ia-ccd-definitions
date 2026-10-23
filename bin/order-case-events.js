import * as assert from "node:assert";
import fs from "fs";

const oldEvents = JSON.parse(fs.readFileSync("./definitions/appeal/json/CaseEvent.json", "utf-8"));

sortAndCompare()

function sortJson() {
  return oldEvents.toSorted((a, b) => a.Name === b.Name ? a.ID.localeCompare(b.ID) : a.Name.localeCompare(b.Name))
    .map((event, index) => {
      if (event.DisplayOrder) {
        event.DisplayOrder = (index + 1) * 3;
      }
      return event;
    });
}

function sortAndCompare() {
  const oldSet = oldEvents.map(({ DisplayOrder, ...event }) => event);
  const sortedEvents = sortJson(oldEvents)
  const newSet = sortedEvents.map(({ DisplayOrder, ...event }) => event);
  oldSet.forEach(oldEvent => {
    const newEvent = newSet.find(event => event.Name === oldEvent.Name && event.ID === oldEvent.ID)
    assert.deepEqual(oldEvent, newEvent)
  })
  fs.writeFileSync("./definitions/appeal/json/CaseEvent.json", JSON.stringify(sortedEvents, null, 2), "utf-8");
}
