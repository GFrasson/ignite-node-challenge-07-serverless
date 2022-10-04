import { APIGatewayProxyHandler } from "aws-lambda";

export const handler: APIGatewayProxyHandler = (event) => {
    const { userId } = event.pathParameters;
}
