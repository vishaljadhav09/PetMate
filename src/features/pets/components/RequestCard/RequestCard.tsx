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
import { RateOwnerDialog } from '../RateOwnerDialog';
import { styles } from './RequestCard.styles';

export interface RequestCardProps {
  request: MatchRequest;
  direction: 'inbox' | 'sent';
}

const STATUS_TONES: Record<MatchRequestStatus, TagTone> = {
  new: 'warning',
  accepted: 'success',
  declined: 'muted',
  completed: 'success',
  cancelled: 'muted',
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

  const counterpartName = counterpartOwner?.name ?? '';
  const counterpartFirstName = counterpartName.split(' ')[0];
  const date = request.createdAt.slice(0, 10);
  const subtitle =
    direction === 'inbox'
      ? [counterpartPet && myPet ? `${counterpartPet.name} × ${myPet.name}` : '', date]
          .filter(Boolean)
          .join(' · ')
      : [
          myPet ? t('requests.fromYourPet', { pet: myPet.name }) : '',
          t('requests.sentOn', { date }),
        ]
          .filter(Boolean)
          .join(' · ');

  return (
    <Card variant="surface">
      <View style={styles.top}>
        <View style={styles.heading}>
          {direction === 'inbox' ? (
            <Text style={styles.title}>{counterpartName}</Text>
          ) : (
            <Text style={styles.title}>
              {counterpartPet?.name ?? ''}
              <Text style={styles.titleNote}>
                {` ${t('requests.ownedBy', { name: counterpartName })}`}
              </Text>
            </Text>
          )}
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <Tag
          label={t(`requests.status.${request.status}`)}
          tone={STATUS_TONES[request.status]}
          size="status"
        />
      </View>

      {request.relativeWarning && (
        <View style={styles.warning}>
          <Notice tone="warning" message={t('requests.relativeWarning')} />
        </View>
      )}

      {!!request.message && (
        <View style={styles.message}>
          <Text style={styles.messageText}>{`"${request.message}"`}</Text>
        </View>
      )}

      {request.status === 'new' && direction === 'inbox' && (
        <View style={styles.actions}>
          <View style={styles.action}>
            <Button
              title={t('requests.declineAction')}
              variant="decline"
              size="sm"
              fullWidth
              onPress={() => run(() => respond.mutateAsync({ id: request.id, status: 'declined' }))}
              loading={respond.isPending}
            />
          </View>
          <View style={styles.action}>
            <Button
              title={t('requests.acceptAction')}
              variant="accept"
              size="sm"
              fullWidth
              onPress={() => run(() => respond.mutateAsync({ id: request.id, status: 'accepted' }))}
              loading={respond.isPending}
            />
          </View>
        </View>
      )}

      {request.status === 'new' && direction === 'sent' && (
        <View style={styles.actions}>
          <View style={styles.action}>
            <Button
              title={t('requests.cancelAction')}
              variant="secondary"
              size="sm"
              fullWidth
              onPress={() => run(() => cancel.mutateAsync(request.id))}
              loading={cancel.isPending}
            />
          </View>
        </View>
      )}

      {isContactVisible && contact && (
        <Text style={styles.contact}>
          {t('requests.contactLine', { name: contact.name.split(' ')[0], phone: contact.phone })}
        </Text>
      )}

      {request.status === 'accepted' && (
        <View style={styles.actions}>
          <View style={styles.action}>
            <Button
              title={t('requests.completeAction')}
              variant="secondary"
              size="sm"
              fullWidth
              onPress={() => run(() => complete.mutateAsync(request.id))}
              loading={complete.isPending}
            />
          </View>
        </View>
      )}

      {request.status === 'completed' && !alreadyRated && counterpartOwner && (
        <View style={styles.actions}>
          <View style={styles.action}>
            <Button
              title={t('requests.rateAction', { name: counterpartFirstName })}
              variant="secondary"
              size="sm"
              fullWidth
              onPress={() => setIsRateDialogOpen(true)}
            />
          </View>
        </View>
      )}

      {request.status === 'completed' && alreadyRated && (
        <Text style={styles.note}>{t('requests.rated')}</Text>
      )}

      {counterpartOwner && (
        <RateOwnerDialog
          visible={isRateDialogOpen}
          onDismiss={() => setIsRateDialogOpen(false)}
          matchRequestId={request.id}
          ratedUserName={counterpartFirstName}
        />
      )}
    </Card>
  );
}
