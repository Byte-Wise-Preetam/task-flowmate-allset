export const summary = {
    totalTasks: 5,
    last5Task: [
        {
          "_id": "65c6a12ab5204a81bde866a9",
          "title": "Design Homepage",
          "description": "Create a responsive homepage layout.",
          "status": "inqueue",
          "priority": "medium",
          "lastDate": "2024-11-23T15:22:34.613Z",
          "taskAdmin": {
            "_id": "6741978d89f895aa41fc3243",
            "firstName": "Alice",
            "lastName": "Wells",
            "email": "alice.wells@gmail.com"
          },
          "assets": [
            "https://example.com/asset1.jpg",
            "https://example.com/asset2.jpg"
          ],
          "team": [
            {
              "_id": "65c202d4aa62f32ffd1303cd",
              "firstName": "Bob",
              "lastName": "Jones",
              "role": "Developer",
              "email": "bob.jones@example.com"
            },
            {
              "_id": "65c30b96e639681a13def0b6",
              "firstName": "Eva",
              "lastName": "Green",
              "role": "Designer",
              "email": "eva.green@example.com"
            },
            {
                "_id": "65c30b96e639681a16tef0b6",
                "firstName": "Dwane",
                "lastName": "Johnson",
                "role": "Designer",
                "email": "dwane.johnson@example.com"
            }
          ],
          "isTrashed": false,
          "activities": [
            {
              "title": "Task created",
              "tag": "started",
              "by": "6741978d89f895aa41fc3243",
              "_id": "6741ba808b618de7e8f5496c",
              "createdAt": "2024-11-23T11:57:13.612Z",
              "updatedAt": "2024-11-23T11:57:13.612Z"
            }
          ],
          "subTasks": [
            {
              "title": "Design Header",
              "tag": "UI/UX",
              "lastDate": "2024-11-29T00:00:00.000Z",
              "description": "Create header layout with logo and menu.",
              "isCompleted": true,
              "_id": "6741c1a36898879371480bf1",
              "createdAt": "2024-11-23T11:57:13.612Z",
              "updatedAt": "2024-11-23T11:57:13.612Z"
            }
          ],
          "createdAt": "2024-11-23T15:22:34.613Z",
          "updatedAt": "2024-11-23T15:23:28.566Z",
          "__v": 0
        },
        {
          "_id": "65c6f12ab5204a81bde866a9",
          "title": "Setup Backend",
          "description": "Initialize backend server using Node.js.",
          "status": "active",
          "priority": "high",
          "lastDate": "2024-12-01T11:57:13.591",
          "taskAdmin": {
            "_id": "6741abc89f895aa41fc3243",
            "firstName": "Mark",
            "lastName": "Russell",
            "email": "mark.russell@gmail.com"
          },
          "assets": [
            "https://example.com/backend_asset1.jpg",
            "https://example.com/backend_asset2.jpg"
          ],
          "team": [
            {
              "_id": "65c202d4aa62f32ffd1303de",
              "firstName": "Chris",
              "lastName": "Pine",
              "role": "Backend Developer",
              "email": "chris.pine@example.com"
            },
            {
              "_id": "65c30b96e639681a13def0b7",
              "firstName": "Sophie",
              "lastName": "Turner",
              "role": "Project Manager",
              "email": "sophie.turner@example.com"
            }
          ],
          "isTrashed": false,
          "activities": [
            {
              "title": "Task created",
              "tag": "started",
              "by": "6741abc89f895aa41fc3243",
              "_id": "6741ba808b618de7e8f5496d",
              "createdAt": "2024-11-23T11:57:13.612Z",
              "updatedAt": "2024-11-23T11:57:13.612Z"
            }
          ],
          "subTasks": [
            {
              "title": "Setup Express",
              "tag": "Backend",
              "lastDate": "2024-12-01T00:00:00.000Z",
              "description": "Install and configure Express.js for routing.",
              "isCompleted": true,
              "_id": "6741c1a36898879371480bf2",
              "createdAt": "2024-11-23T11:57:13.612Z",
              "updatedAt": "2024-11-23T11:57:13.612Z"
            },
            {
                "title": "Setup Express",
                "tag": "Backend",
                "lastDate": "2024-12-01T00:00:00.000Z",
                "description": "Install and configure Express.js for routing.",
                "isCompleted": false,
                "_id": "6741c1a3689887937148l9f2",
                "createdAt": "2024-11-23T11:57:13.612Z",
                "updatedAt": "2024-11-23T11:57:13.612Z"
            }
          ],
          "createdAt": "2024-11-23T15:22:34.613Z",
          "updatedAt": "2024-11-23T15:23:28.566Z",
          "__v": 0
        },
        {
          "_id": "65c7e12ab5204a81bde866b1",
          "title": "API Integration",
          "description": "Integrate payment gateway API.",
          "status": "active",
          "priority": "high",
          "lastDate": "2024-11-29T11:57:13.591",
          "taskAdmin": {
            "_id": "6741def89f895aa41fc3243",
            "firstName": "Harry",
            "lastName": "Styles",
            "email": "harry.styles@gmail.com"
          },
          "assets": [
            "https://example.com/payment_api_asset1.jpg"
          ],
          "team": [
            {
              "_id": "65c202d4aa62f32ffd1303df",
              "firstName": "Olivia",
              "lastName": "Brown",
              "role": "Developer",
              "email": "olivia.brown@example.com"
            },
            {
              "_id": "65c30b96e639681a13def0b8",
              "firstName": "Liam",
              "lastName": "Johnson",
              "role": "Tester",
              "email": "liam.johnson@example.com"
            }
          ],
          "isTrashed": false,
          "activities": [
            {
              "title": "API key generated",
              "tag": "started",
              "by": "6741def89f895aa41fc3243",
              "_id": "6741ba808b618de7e8f5496e",
              "createdAt": "2024-11-23T11:57:13.612Z",
              "updatedAt": "2024-11-23T11:57:13.612Z"
            }
          ],
          "subTasks": [
            {
              "title": "Add API Endpoints",
              "tag": "Backend",
              "lastDate": "2024-11-30T00:00:00.000Z",
              "description": "Add endpoints for payment processing.",
              "isCompleted": false,
              "_id": "6741c1a36898879371480bf3",
              "createdAt": "2024-11-23T11:57:13.612Z",
              "updatedAt": "2024-11-23T11:57:13.612Z"
            }
          ],
          "createdAt": "2024-11-23T15:22:34.613Z",
          "updatedAt": "2024-11-23T15:23:28.566Z",
          "__v": 0
        },
        {
            "_id": "65c9e12ab5204a81bde866d3",
            "title": "Bug Fixing",
            "description": "Resolve issues with the product detail page.",
            "status": "completed",
            "priority": "low",
            "lastDate": "2024-11-29T11:57:13.591",
            "taskAdmin": {
              "_id": "6741973b89f895aa41fc3242",
              "firstName": "Daniel",
              "lastName": "Craig",
              "email": "daniel.craig@gmail.com"
            },
            "assets": [
              "https://example.com/bugfix_asset1.jpg"
            ],
            "team": [
              {
                "_id": "65c202d4aa62f32ffd1303e1",
                "firstName": "Matthew",
                "lastName": "McConaughey",
                "role": "Tester",
                "email": "matthew.mcconaughey@example.com"
              },
              {
                "_id": "65c30b96e639681a13def0ba",
                "firstName": "Jessica",
                "lastName": "Alba",
                "role": "Developer",
                "email": "jessica.alba@example.com"
              }
            ],
            "isTrashed": false,
            "activities": [
              {
                "title": "Bug reported",
                "tag": "started",
                "by": "6741973b89f895aa41fc3242",
                "_id": "6741ba808b618de7e8f54970",
                "createdAt": "2024-11-23T11:57:13.612Z",
                "updatedAt": "2024-11-23T11:57:13.612Z"
              }
            ],
            "subTasks": [
              {
                "title": "Fix layout issue",
                "tag": "Frontend",
                "lastDate": "2024-11-30T00:00:00.000Z",
                "description": "Resolve CSS layout issue on product page.",
                "isCompleted": false,
                "_id": "6741c1a36898879371480bf5",
                "createdAt": "2024-11-23T11:57:13.612Z",
                "updatedAt": "2024-11-23T11:57:13.612Z"
              }
            ],
            "createdAt": "2024-11-23T15:22:34.613Z",
            "updatedAt": "2024-11-23T15:23:28.566Z",
            "__v": 0
        },
        {
          "_id": "65c8e12ab5204a81bde866c2",
          "title": "User Authentication",
          "description": "Implement JWT authentication for login.",
          "status": "inqueue",
          "priority": "high",
          "lastDate": "2024-11-27T11:57:13.591",
          "taskAdmin": {
            "_id": "6741efg89f895aa41fc3243",
            "firstName": "Emma",
            "lastName": "Watson",
            "email": "emma.watson@gmail.com"
          },
          "assets": [
            "https://example.com/auth_asset1.jpg"
          ],
          "team": [
            {
              "_id": "65c202d4aa62f32ffd1303e0",
              "firstName": "Sophia",
              "lastName": "Davis",
              "role": "Frontend Developer",
              "email": "sophia.davis@example.com"
            },
            {
              "_id": "65c30b96e639681a13def0b9",
              "firstName": "James",
              "lastName": "Miller",
              "role": "Security Specialist",
              "email": "james.miller@example.com"
            }
          ],
          "isTrashed": false,
          "activities": [
            {
              "title": "Task assigned",
              "tag": "started",
              "by": "6741efg89f895aa41fc3243",
              "_id": "6741ba808b618de7e8f5496f",
              "createdAt": "2024-11-23T11:57:13.612Z",
              "updatedAt": "2024-11-23T11:57:13.612Z"
            }
          ],
          "subTasks": [
            {
              "title": "Add login route",
              "tag": "Backend",
              "lastDate": "2024-11-27T00:00:00.000Z",
              "description": "Create route for user login.",
              "isCompleted": false,
              "_id": "6741c1a36898879371480bf4",
              "createdAt": "2024-11-23T11:57:13.612Z",
              "updatedAt": "2024-11-23T11:57:13.612Z"
            }
          ],
          "createdAt": "2024-11-23T15:22:34.613Z",
          "updatedAt": "2024-11-23T15:23:28.566Z",
          "__v": 0
        },
        
    ]
}
    