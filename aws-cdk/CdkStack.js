"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AskGramperlyStack = void 0;
const cdk = require("@aws-cdk/core");
//import cdk = require('@aws-cdk/core');
const AskGramperlyWebSite_1 = require("./AskGramperlyWebSite");
class AskGramperlyStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // The code that defines your stack goes here
        const askGramperlyPublic = new AskGramperlyWebSite_1.AskGramperlyWebSite(this);
        askGramperlyPublic.deploySite();
    }
}
exports.AskGramperlyStack = AskGramperlyStack;
const app = new cdk.App();
new AskGramperlyStack(app, 'AskGramperlyStack');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2RrU3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJDZGtTdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBcUM7QUFDckMsd0NBQXdDO0FBQ3hDLCtEQUEwRDtBQUMxRCxNQUFhLGlCQUFrQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzlDLFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsNkNBQTZDO1FBQzdDLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSx5Q0FBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6RCxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUVsQyxDQUFDO0NBQ0Y7QUFURCw4Q0FTQztBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLElBQUksaUJBQWlCLENBQUMsR0FBRyxFQUFFLG1CQUFtQixDQUFDLENBQUM7QUFDaEQsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuLy9pbXBvcnQgY2RrID0gcmVxdWlyZSgnQGF3cy1jZGsvY29yZScpO1xuaW1wb3J0IHtBc2tHcmFtcGVybHlXZWJTaXRlfSBmcm9tIFwiLi9Bc2tHcmFtcGVybHlXZWJTaXRlXCI7XG5leHBvcnQgY2xhc3MgQXNrR3JhbXBlcmx5U3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy8gVGhlIGNvZGUgdGhhdCBkZWZpbmVzIHlvdXIgc3RhY2sgZ29lcyBoZXJlXG4gICAgY29uc3QgYXNrR3JhbXBlcmx5UHVibGljID0gbmV3IEFza0dyYW1wZXJseVdlYlNpdGUodGhpcyk7XG4gICAgYXNrR3JhbXBlcmx5UHVibGljLmRlcGxveVNpdGUoKTtcblxuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5uZXcgQXNrR3JhbXBlcmx5U3RhY2soYXBwLCAnQXNrR3JhbXBlcmx5U3RhY2snKTtcbmFwcC5zeW50aCgpO1xuIl19