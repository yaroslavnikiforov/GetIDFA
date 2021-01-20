import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  getTrackingStatus,
  requestTrackingPermission,
  TrackingStatus,
} from 'react-native-tracking-transparency';
import {IDFA} from 'react-native-idfa';

const TrackingStatuses = {
  UNAVAILABLE: 'unavailable',
  DENIED: 'denied',
  AUTHORIZED: 'authorized',
  RESTRICTED: 'restricted',
  NOT_DETERMINED: 'not-determined',
};

export default function App() {
  const [idfa, setIdfa] = useState('');
  const [trackingStatus, setTrackingStatus] = useState('');

  useEffect(() => {
    getTrackingStatus()
      .then((getStatusResult) => {
        if (getStatusResult === TrackingStatuses.NOT_DETERMINED) {
          requestTrackingPermission()
            .then((requestStatusResult) =>
              setTrackingStatus(requestStatusResult),
            )
            .catch((e) => console.log(e));
        } else {
          setTrackingStatus(getStatusResult);
        }
      })
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    if (
      trackingStatus === TrackingStatuses.AUTHORIZED ||
      trackingStatus === TrackingStatuses.UNAVAILABLE
    ) {
      IDFA.getIDFA()
        .then((result) => {
          setIdfa(result);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [trackingStatus]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>IDFA:</Text>

      <Text style={styles.idfa}>{idfa}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
  },

  title: {
    fontSize: 20,
    marginBottom: 20,
  },

  idfa: {
    fontSize: 15,
  },
});
