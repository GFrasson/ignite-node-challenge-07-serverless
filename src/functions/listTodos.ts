import { APIGatewayProxyHandler } from "aws-lambda";

import { document } from "../utils/dynamodbClient";

export const handler: APIGatewayProxyHandler = async (event) => {
    const { userId } = event.pathParameters;
    
    const response = await document.query({
        TableName: "todos",
        IndexName: "User-index",
        ScanIndexForward: false,
        KeyConditionExpression: "user_id = :user_id",
        ExpressionAttributeValues: {
            ":user_id": userId
        }
    }).promise();

    const todos = response.Items;

    return {
        statusCode: 200,
        body: JSON.stringify(todos)
    }
}
