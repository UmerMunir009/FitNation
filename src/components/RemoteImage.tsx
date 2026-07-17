import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageProps,
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
} from 'react-native';
import { ImageOff } from 'lucide-react-native';

type RemoteImageProps = Omit<ImageProps, 'source'> & {
  sourceUri?: string | null;
  style?: StyleProp<ImageStyle>;
};

const RemoteImage = ({
  sourceUri,
  style,
  resizeMode = 'cover',
  ...props
}: RemoteImageProps) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [sourceUri]);

  if (!sourceUri || hasError) {
    return (
      <View style={[styles.fallback, style]}>
        <ImageOff size={28} color="#777" />
      </View>
    );
  }

  return (
    <Image
      {...props}
      source={{ uri: sourceUri }}
      style={style}
      resizeMode={resizeMode}
      onError={() => setHasError(true)}
    />
  );
};

export default RemoteImage;

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#202020',
  },
});
