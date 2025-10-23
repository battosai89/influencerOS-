"use client";

import { NewCampaignModal } from '../../../components/CreationModals';
import { useRouter } from 'next/navigation';

const NewCampaignPage: React.FC = () => {
    const router = useRouter();

    const handleClose = () => {
        router.push('/campaigns');
    };

    return (
        <NewCampaignModal isOpen={true} onClose={handleClose} />
    );
};

export default NewCampaignPage;