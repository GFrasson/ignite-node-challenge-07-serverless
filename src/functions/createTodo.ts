import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidV4 } from 'uuid';

import { document } from '../utils/dynamodbClient';

interface ICreateTodo {
    title: string;
    deadline: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
    const { userId } = event.pathParameters;
    const { title, deadline } = JSON.parse(event.body) as ICreateTodo;

    await document.put({
        TableName: "todos",
        Item: {
            id: uuidV4(),
            user_id: userId,
            title,
            done: false,
            deadline: new Date(deadline).getTime()
        }
    }).promise();

    return {
        statusCode: 201,
        body: JSON.stringify({
            message: "Todo criado com sucesso!",
        })
    }
}
