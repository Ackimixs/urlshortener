<template>
  <div class="h-full grid place-items-center">
    <div class="flex flex-col items-center">
      <h1 class="text-2xl">Shortener</h1>
      <div v-if="loggedIn" class="flex flex-row">
        <div class="custom-btn">
          <NuxtLink to="/dashboard">Dashboard</NuxtLink>
        </div>
        <button @click="handleSignOut" class="custom-btn">Sign Out</button>
      </div>
      <div v-else class="custom-btn">
        <NuxtLink to="/login">Login</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ auth: false });

const { status, signOut } = useAuth();

const loggedIn = computed(() => status.value === "authenticated");

const handleSignOut = async () => {
  await signOut();
};
</script>
