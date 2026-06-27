import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, MapPin, Plus, Trash2 } from "lucide-react-native";

import { useAddresses, useAddAddress, useDeleteAddress } from "@/hooks/useAddresses";
import { colors } from "@/constants/colors";

export default function SavedAddressesScreen() {
  const { data: addresses = [], isLoading } = useAddresses();
  const addAddress = useAddAddress();
  const deleteAddress = useDeleteAddress();

  const [modalOpen, setModalOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSave() {
    if (line1.trim().length < 4) return setError("Please enter the street/house details.");
    if (city.trim().length < 2) return setError("Please enter a city.");
    setError(null);
    try {
      await addAddress.mutateAsync({
        label: label.trim() || "Home",
        line1: line1.trim(),
        city: city.trim(),
        isDefault: addresses.length === 0,
      });
      setLabel("");
      setLine1("");
      setCity("");
      setModalOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save address.");
    }
  }

  return (
    <View className="flex-1 bg-surface">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />

      <SafeAreaView edges={["top"]} className="bg-white">
        <View className="flex-row items-center gap-3 px-4 pb-3 pt-2">
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ArrowLeft size={24} color="#111827" />
          </Pressable>
          <Text className="text-xl font-bold text-gray-900">Saved addresses</Text>
        </View>
      </SafeAreaView>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
          {addresses.length === 0 ? (
            <View className="items-center py-16">
              <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <MapPin size={28} color={colors.primary} />
              </View>
              <Text className="text-base font-semibold text-gray-900">No saved addresses</Text>
              <Text className="mt-1 text-center text-sm text-gray-500">
                Add an address to check out faster.
              </Text>
            </View>
          ) : (
            addresses.map((a) => (
              <View
                key={a.id}
                className="mb-3 flex-row items-start gap-3 rounded-2xl bg-white p-4"
              >
                <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <MapPin size={18} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="font-semibold text-gray-900">{a.label ?? "Address"}</Text>
                    {a.isDefault ? (
                      <View className="rounded-full bg-primary/10 px-2 py-0.5">
                        <Text className="text-[10px] font-bold text-primary">DEFAULT</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text className="mt-0.5 text-sm text-gray-500">
                    {a.line1}
                    {a.city ? `, ${a.city}` : ""}
                  </Text>
                </View>
                <Pressable onPress={() => deleteAddress.mutate(a.id)} hitSlop={8}>
                  <Trash2 size={18} color="#dc2626" />
                </Pressable>
              </View>
            ))
          )}

          <Pressable
            onPress={() => setModalOpen(true)}
            className="mt-2 h-14 flex-row items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/40 active:opacity-80"
          >
            <Plus size={20} color={colors.primary} />
            <Text className="font-bold text-primary">Add new address</Text>
          </Pressable>
        </ScrollView>
      )}

      {/* Add modal */}
      <Modal visible={modalOpen} transparent animationType="slide" onRequestClose={() => setModalOpen(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 justify-end bg-black/40"
        >
          <View className="rounded-t-3xl bg-white p-5">
            <Text className="mb-4 text-lg font-bold text-gray-900">New address</Text>
            <Field label="Label (e.g. Home, Office)" value={label} onChangeText={setLabel} placeholder="Home" />
            <Field
              label="Street / house number / area"
              value={line1}
              onChangeText={setLine1}
              placeholder="12 Oxford St, Osu"
            />
            <Field label="City" value={city} onChangeText={setCity} placeholder="Accra" />
            {error ? <Text className="mb-2 text-sm text-red-500">{error}</Text> : null}
            <View className="mt-2 flex-row gap-3">
              <Pressable
                onPress={() => setModalOpen(false)}
                className="h-12 flex-1 items-center justify-center rounded-2xl bg-gray-100"
              >
                <Text className="font-semibold text-gray-700">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={onSave}
                disabled={addAddress.isPending}
                className="h-12 flex-1 items-center justify-center rounded-2xl bg-primary active:opacity-90"
              >
                <Text className="font-bold text-white">
                  {addAddress.isPending ? "Saving…" : "Save"}
                </Text>
              </Pressable>
            </View>
            <SafeAreaView edges={["bottom"]} />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
}) {
  return (
    <View className="mb-3">
      <Text className="mb-1.5 text-sm font-medium text-gray-700">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        className="h-12 rounded-xl border border-gray-200 bg-white px-4 text-base text-gray-900"
      />
    </View>
  );
}
