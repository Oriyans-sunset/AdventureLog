import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect root route to the Daily tab as the main screen.
  return <Redirect href="/(tabs)/daily" />;
}
