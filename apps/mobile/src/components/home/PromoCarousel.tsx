import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  type ImageSourcePropType,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { router } from "expo-router";

const { width: SCREEN_W } = Dimensions.get("window");
const CARD_W = SCREEN_W - 40; // 20px horizontal padding each side

interface Promo {
  title: string;
  subtitle: string;
  cta: string;
  image: ImageSourcePropType;
  bg: string; // soft tint
}

const PROMOS: Promo[] = [
  {
    title: "30% off your\nfirst order",
    subtitle: "On your first order over ₵100",
    cta: "Order Now",
    image: require("@/assets/images/banners/free-delivery.png"),
    bg: "#dff3e6",
  },
  {
    title: "Fresh fruits\ndelivered daily",
    subtitle: "Picked this morning, just for you",
    cta: "Shop Now",
    image: require("@/assets/images/banners/fresh-daily.png"),
    bg: "#fdeede",
  },
  {
    title: "Save 20% on\npantry staples",
    subtitle: "Selected items this week only",
    cta: "Grab Deal",
    image: require("@/assets/images/banners/fresh-daily.png"),
    bg: "#e7eefb",
  },
];

export function PromoCarousel() {
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      const next = (index + 1) % PROMOS.length;
      scrollRef.current?.scrollTo({ x: next * CARD_W, animated: true });
      setIndex(next);
    }, 5000);
    return () => clearInterval(t);
  }, [index]);

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const i = Math.round(e.nativeEvent.contentOffset.x / CARD_W);
    if (i !== index) setIndex(i);
  }

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        decelerationRate="fast"
        snapToInterval={CARD_W}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {PROMOS.map((p, i) => (
          <View key={i} style={{ width: CARD_W }}>
            <View
              style={{ backgroundColor: p.bg, height: 160 }}
              className="mx-0.5 flex-row overflow-hidden rounded-3xl"
            >
              {/* Text + CTA */}
              <View className="flex-1 justify-center py-5 pl-5">
                <Text className="text-xl font-extrabold leading-6 text-gray-900">{p.title}</Text>
                <Text className="mt-1 text-xs text-gray-500">{p.subtitle}</Text>
                <Pressable
                  onPress={() => router.push("/(tabs)/categories")}
                  className="mt-3 self-start rounded-full bg-gray-900 px-5 py-2.5 active:opacity-80"
                >
                  <Text className="text-xs font-bold text-white">{p.cta}</Text>
                </Pressable>
              </View>
              {/* Image bleeding to the right edge */}
              <View className="w-36 items-center justify-center">
                <Image source={p.image} style={{ width: 150, height: 150 }} resizeMode="contain" />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Dots */}
      <View className="mt-3 flex-row justify-center gap-1.5">
        {PROMOS.map((_, i) => (
          <View
            key={i}
            className={`h-1.5 rounded-full ${i === index ? "w-5 bg-primary" : "w-1.5 bg-gray-300"}`}
          />
        ))}
      </View>
    </View>
  );
}
