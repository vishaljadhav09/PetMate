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
import type { MatchRequest } from '@/features/pets/types';
import { useAuthStore } from '@/providers/auth/authStore';

type RequestsSubtab = 'inbox' | 'sent';

function sortByCreatedAtDesc(requests: MatchRequest[]): MatchRequest[] {
  return [...requests].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export default function RequestsTab() {
  const { t } = useTranslation();
  const userId = useAuthStore((s) => s.user?.id);
  const { data: requests, isLoading } = useMatchRequests();
  const [subtab, setSubtab] = useState<RequestsSubtab>('inbox');

  const inbox = useMemo(
    () => sortByCreatedAtDesc((requests ?? []).filter((r) => r.recipientOwnerId === userId)),
    [requests, userId]
  );
  const sent = useMemo(
    () => sortByCreatedAtDesc((requests ?? []).filter((r) => r.senderOwnerId === userId)),
    [requests, userId]
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
