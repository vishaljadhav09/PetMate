import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { Dialog } from '@/common/components';
import { deleteMyAccount } from '@/features/auth/services/authService';

export interface DeleteAccountDialogProps {
  visible: boolean;
  onDismiss: () => void;
}

export function DeleteAccountDialog({ visible, onDismiss }: DeleteAccountDialogProps) {
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDismiss = () => {
    if (!isDeleting) onDismiss();
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteMyAccount();
    } catch {
      Toast.show({ type: 'error', text1: t('profile.deleteAccountFailed') });
      onDismiss();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      visible={visible}
      onDismiss={handleDismiss}
      title={t('profile.deleteAccountTitle')}
      message={t('profile.deleteAccountMessage')}
      dismissOnBackdropPress={!isDeleting}
      actions={[
        { label: t('common.cancel'), onPress: handleDismiss },
        { label: t('common.delete'), onPress: handleDelete, variant: 'primary' },
      ]}
    />
  );
}
