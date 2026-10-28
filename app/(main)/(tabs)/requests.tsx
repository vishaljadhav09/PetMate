import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import {
  EmptyState,
  Loading,
  ResponsiveList,
  ScreenContainer,
  ScreenHeader,
  SegmentedControl,
} from '@/common/components';
import { RequestCard } from '@/features/pets/components/RequestCard';
import { useMatchRequests } from '@/features/pets/hooks/useMatchRequests';
import { MOCK_CURRENT_USER_ID } from '@/features/pets/services/mockDb';
import type { MatchRequest } from '@/features/pets/types';

type RequestsSubtab = 'inbox' | 'sent';

function sortByCreatedAtDesc(requests: MatchRequest[]): MatchRequest[] {
  return [...requests].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export default function RequestsTab() {
  const { t } = useTranslation();
  const { data: requests, isLoading } = useMatchRequests();
  const [subtab, setSubtab] = useState<RequestsSubtab>('inbox');

  const inbox = useMemo(
    () =>
      sortByCreatedAtDesc(
        (requests ?? []).filter((r) => r.recipientOwnerId === MOCK_CURRENT_USER_ID)
      ),
    [requests]
  );
  const sent = useMemo(
    () =>
      sortByCreatedAtDesc((requests ?? []).filter((r) => r.senderOwnerId === MOCK_CURRENT_USER_ID)),
    [requests]
  );
  const list = subtab === 'inbox' ? inbox : sent;
  const emptyTitle =
    subtab === 'inbox' ? t('requests.emptyInboxTitle') : t('requests.emptySentTitle');
  const emptyMessage =
    subtab === 'inbox' ? t('requests.emptyInboxMessage') : t('requests.emptySentMessage');

  return (
    <ScreenContainer contentWidth="wide">
      <ScreenHeader title={t('requests.title')} subtitle={t('requests.subtitle')} />

      <View className="pb-4">
        <SegmentedControl
          value={subtab}
          onChange={(value) => setSubtab(value as RequestsSubtab)}
          options={[
            { label: `${t('requests.tabs.inbox')} (${inbox.length})`, value: 'inbox' },
            { label: `${t('requests.tabs.sent')} (${sent.length})`, value: 'sent' },
          ]}
        />
      </View>

      {isLoading ? (
        <Loading />
      ) : (
        <ResponsiveList
          data={list}
          keyExtractor={(request) => request.id}
          renderItem={(request) => <RequestCard request={request} direction={subtab} />}
          emptyComponent={<EmptyState title={emptyTitle} message={emptyMessage} />}
        />
      )}
    </ScreenContainer>
  );
}
