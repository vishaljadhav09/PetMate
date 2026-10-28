import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import { Button, Card, Notice, Tag, Text } from '@/common/components';
import type { TagTone } from '@/common/components';
import { useAuthStore } from '@/providers/auth/authStore';
import { friendlyError } from '@/utils/friendlyError';
import {
  useCancelMatchRequest,
  useCompleteMatchRequest,
  useMatchContact,
  useRespondToMatchRequest,
} from '../../hooks/useMatchRequests';
import { usePet, usePetOwner } from '../../hooks/usePets';
import { useRatingsForMatchRequest } from '../../hooks/useRatings';
import type { MatchRequest, MatchRequestStatus } from '../../types';
import { OwnerAvatar } from '../OwnerAvatar';
import { RateOwnerDialog } from '../RateOwnerDialog';

export interface RequestCardProps {
  request: MatchRequest;
  direction: 'inbox' | 'sent';
}

const STATUS_TONES: Record<MatchRequestStatus, TagTone> = {
  new: 'info',
  accepted: 'success',
  declined: 'neutral',
  completed: 'neutral',
  cancelled: 'neutral',
};

export function RequestCard({ request, direction }: RequestCardProps) {
  const { t } = useTranslation();
  const userId = useAuthStore((s) => s.user?.id);
  const counterpartOwnerId =
    direction === 'inbox' ? request.senderOwnerId : request.recipientOwnerId;
  const counterpartPetId = direction === 'inbox' ? request.senderPetId : request.recipientPetId;
  const myPetId = direction === 'inbox' ? request.recipientPetId : request.senderPetId;
  const { data: counterpartOwner } = usePetOwner(counterpartOwnerId);
  const { data: counterpartPet } = usePet(counterpartPetId);
  const { data: myPet } = usePet(myPetId);
  const { data: existingRatings } = useRatingsForMatchRequest(request.id);
  const isContactVisible = request.status === 'accepted' || request.status === 'completed';
  const { data: contact } = useMatchContact(request.id, isContactVisible);
  const respond = useRespondToMatchRequest();
  const complete = useCompleteMatchRequest();
  const cancel = useCancelMatchRequest();
  const [isRateDialogOpen, setIsRateDialogOpen] = useState(false);

  const alreadyRated = (existingRatings ?? []).some((rating) => rating.raterUserId === userId);

  const run = async (action: () => Promise<unknown>) => {
    try {
      await action();
    } catch (error) {
      Toast.show({ type: 'error', text1: friendlyError(error, t) });
    }
  };

  return (
    <Card variant="surface">
      <View className="gap-3">
        <View className="flex-row items-start justify-between gap-2">
          <View className="flex-1 flex-row items-center gap-3">
            {counterpartOwner && (
              <OwnerAvatar ownerId={counterpartOwner.id} name={counterpartOwner.name} size="md" />
            )}
            <View className="flex-1 gap-0.5">
              <Text variant="label">{counterpartOwner?.name ?? ''}</Text>
              <Text variant="bodySmall" color="secondary">
                {myPet && counterpartPet ? `${myPet.name} × ${counterpartPet.name}` : ''}
              </Text>
            </View>
          </View>
          <Tag label={t(`requests.status.${request.status}`)} tone={STATUS_TONES[request.status]} />
        </View>

        {request.relativeWarning && (
          <Notice tone="warning" message={t('requests.relativeWarning')} />
        )}

        {!!request.message && (
          <View className="rounded-xl bg-surface-alt p-3 dark:bg-surface-alt-dark">
            <Text variant="bodySmall">{request.message}</Text>
          </View>
        )}

        {request.status === 'new' && direction === 'inbox' && (
          <View className="flex-row gap-2">
            <View className="flex-1">
              <Button
                title={t('requests.declineAction')}
                variant="outline"
                fullWidth
                onPress={() =>
                  run(() => respond.mutateAsync({ id: request.id, status: 'declined' }))
                }
                loading={respond.isPending}
              />
            </View>
            <View className="flex-1">
              <Button
                title={t('requests.acceptAction')}
                fullWidth
                onPress={() =>
                  run(() => respond.mutateAsync({ id: request.id, status: 'accepted' }))
                }
                loading={respond.isPending}
              />
            </View>
          </View>
        )}

        {request.status === 'new' && direction === 'sent' && (
          <Button
            title={t('requests.cancelAction')}
            variant="outline"
            fullWidth
            onPress={() => run(() => cancel.mutateAsync(request.id))}
            loading={cancel.isPending}
          />
        )}

        {isContactVisible && contact && (
          <Text variant="bodySmall" color="secondary">
            {t('requests.contactRevealedLabel', { name: contact.name, phone: contact.phone })}
          </Text>
        )}

        {request.status === 'accepted' && (
          <Button
            title={t('requests.completeAction')}
            variant="secondary"
            fullWidth
            onPress={() => run(() => complete.mutateAsync(request.id))}
            loading={complete.isPending}
          />
        )}

        {request.status === 'completed' && !alreadyRated && counterpartOwner && (
          <Button
            title={t('requests.rateAction', { name: counterpartOwner.name })}
            variant="secondary"
            fullWidth
            onPress={() => setIsRateDialogOpen(true)}
          />
        )}

        {request.status === 'completed' && alreadyRated && (
          <Text variant="bodySmall" color="secondary">
            {t('requests.rated')}
          </Text>
        )}

        {counterpartOwner && (
          <RateOwnerDialog
            visible={isRateDialogOpen}
            onDismiss={() => setIsRateDialogOpen(false)}
            matchRequestId={request.id}
            ratedUserName={counterpartOwner.name}
          />
        )}
      </View>
    </Card>
  );
}
