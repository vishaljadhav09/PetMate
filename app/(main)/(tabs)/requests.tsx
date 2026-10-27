import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';
import { EmptyState, Loading, ScreenContainer, SegmentedControl, Text } from '@/common/components';
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
    <ScreenContainer>
      <View className="gap-1 pb-4">
        <Text variant="h1">{t('requests.title')}</Text>
        <Text variant="body" color="secondary">
          {t('requests.subtitle')}
        </Text>
      </View>

      <View className="pb-3">
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
        <FlatList<MatchRequest>
          className="flex-1"
          data={list}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RequestCard request={item} direction={subtab} />}
          contentContainerClassName="gap-3 pb-6"
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyState title={emptyTitle} message={emptyMessage} />}
        />
      )}
    </ScreenContainer>
  );
}
