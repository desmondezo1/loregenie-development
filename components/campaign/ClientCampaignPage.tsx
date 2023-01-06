'use client';

import { Campaign } from '@/types';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

interface Props {
  campaign: Campaign;
  worldID: string;
}

const ClientCampaignPage = ({ campaign, worldID }: Props) => {
  const router = useRouter();

  const onDelete = async () => {
    try {
      await fetch('/api/campaign/delete', {
        method: 'POST',
        body: JSON.stringify({ campaignID: campaign.id, worldID }),
      });
      router.push(`/world/${worldID}`);
      router.refresh();
    } catch (error) {
      console.log('error deleting campaign: ', error);
    }
  };

  return (
    <>
      <h1>name: {campaign.name}</h1>
      <div>description: {campaign.description}</div>
      <div>readers: {campaign.readers.join(', ')}</div>
      <div>writers: {campaign.writers.join(', ')}</div>
      <div>admins: {campaign.admins.join(', ')}</div>
      <div>visibility: {campaign.public ? 'public' : 'private'}</div>
      <Button
        variant='contained'
        sx={{ margin: 1 }}
        onClick={() =>
          router.push(`/world/${worldID}/campaign/${campaign.id}/edit`)
        }
      >
        Edit Campaign
      </Button>
      <Button
        variant='contained'
        sx={{ margin: 1 }}
        color='error'
        onClick={() => onDelete()}
      >
        Delete Campaign
      </Button>
      <Button onClick={() => router.push(`/world/${worldID}`)}>
        Return To World
      </Button>
    </>
  );
};

export default ClientCampaignPage;
