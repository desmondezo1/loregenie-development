'use client';

import { Campaign, World } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import ImageSettings from '@/components/ImageSettings';
import PageBody from '@/components/PageBody';
import { Session } from 'next-auth';
import { useClientContext } from '@/hooks/useClientContext';

type Props = {
  world: World;
  campaign: Campaign;
  permissions: string[];
  session: Session;
};

const ClientCampaignPage = ({ world, campaign, permissions, session }: Props) => {
  const [campaignData, setCampaignData] = useState<Campaign>(campaign);
  const { setClient } = useClientContext();
  const router = useRouter();

  useEffect(() => {
    setClient({ world, campaign });
  }, [campaign]);

  const onDelete = async () => {
    try {
      await fetch('/api/campaign/delete', {
        method: 'POST',
        body: JSON.stringify({
          worldID: world.id,
          campaignID: campaign.id,
          permissions,
        }),
      });
      router.push(`/world/${world.id}`);
      router.refresh();
    } catch (error) {
      console.log('error deleting campaign: ', error);
    }
  };

  const onSave = async () => {
    try {
      await fetch('/api/campaign/update', {
        method: 'POST',
        body: JSON.stringify({
          campaignData,
          campaignID: campaign.id,
          worldID: world.id,
          permissions,
        }),
      });
      router.refresh();
    } catch (error) {
      console.log('error updating campaign: ', error);
    }
  };

  return (
    <div className='flex flex-col w-full h-full mb-12'>
      <PageHeader<Campaign>
        data={campaignData}
        currentData={campaign}
        setData={setCampaignData}
        onSave={onSave}
        onDelete={onDelete}
        permissions={permissions}
        session={session}
      />
      <div className='flex flex-col items-start gap-10 px-16 py-6 overflow-y-scroll bg-white grow isolate scrollbar-hide'>
        <div className='relative min-h-[352px] max-h-[352px] w-full rounded-2xl bg-lore-beige-400'>
          <div className='absolute flex bottom-4 right-4'>
            <ImageSettings<Campaign>
              data={campaignData}
              setData={setCampaignData}
              permissions={permissions}
            />
          </div>
          {campaignData.image && (
            <img
              className='object-cover w-full h-full rounded-lg'
              src={campaignData.image}
              alt=''
            />
          )}
        </div>
        <PageBody<Campaign>
          data={campaignData}
          setData={setCampaignData}
          permissions={permissions}
        />
      </div>
    </div>
  );
};

export default ClientCampaignPage;
