import { Converter, db } from '@/lib/db';
import { PermissionLevel, WorldDB } from '@/types';
import { contributorSanityCheck } from '@/utils/contributorSanityCheck';
import { hasPermission } from '@/utils/hasPermission';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const { worldData }: { worldData: WorldDB } = JSON.parse(request.body);

  const docRef = db
    .collection('worlds')
    .doc(worldData.id)
    .withConverter(new Converter<WorldDB>());

  const docData = (await docRef.get()).data();

  try {
    if (
      !(await hasPermission(
        request,
        response,
        worldData.id,
        PermissionLevel.writer
      )) ||
      !(await contributorSanityCheck(request, response, worldData, docData))
    ) {
      response.statusCode = 500;
      response.send({});
      return;
    }
    await docRef.update(worldData);
  } catch (error) {
    console.log('error updating world in database: ', error);
    response.statusCode = 500;
    response.send({});
    return;
  }
  response.send({});
}
