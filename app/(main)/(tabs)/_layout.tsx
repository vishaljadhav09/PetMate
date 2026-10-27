import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { TabBar } from '@/common/components/TabBar';

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
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
