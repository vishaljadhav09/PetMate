import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { TabBar } from '@/common/components/TabBar';
import { useNewInboxCount } from '@/features/pets/hooks/useMatchRequests';
import { TopBar } from '@/features/profile/components/TopBar';

export default function TabLayout() {
  const { t } = useTranslation();
  const newInboxCount = useNewInboxCount();

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} badges={{ requests: newInboxCount }} />}
      screenOptions={{
        header: () => <TopBar />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.discover'),
        }}
      />
      <Tabs.Screen
        name="my-pets"
        options={{
          title: t('tabs.myPets'),
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: t('tabs.requests'),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
        }}
      />
    </Tabs>
  );
}
