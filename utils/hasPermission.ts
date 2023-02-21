import { getCampaignPermissions, getPermissions } from '@/lib/db';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { PermissionLevel } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession, Session } from 'next-auth';

export const hasPermission = async (
  request: NextApiRequest,
  response: NextApiResponse,
  worldID: string,
  permissionLevel: PermissionLevel,
  campaignID?: string
): Promise<Boolean> => {
  try {
    const session: Session | null = await getServerSession(
      request,
      response,
      authOptions
    );
    let permissions: string[] = [];
    if (campaignID) {
      permissions = await getCampaignPermissions(
        worldID,
        campaignID,
        session?.user?.email as string
      );
    } else {
      permissions = await getPermissions(
        worldID,
        session?.user?.email as string
      );
    }
    if (!permissions.includes(permissionLevel)) {
      console.log('user does not have permission for that action.');
    }
    return permissions.includes(permissionLevel);
  } catch (error) {
    console.log(error);
    return false;
  }
};
