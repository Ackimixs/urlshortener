<template>
  <div class="h-full grid place-items-center">
    <div class="flex flex-col gap-5 text-center">
      <NuxtLink to="/">HOME</NuxtLink>
      <button @click="signInWithGithub" class="p-1 border rounded-2xl w-64">
        Connect with Github
      </button>
      <button @click="signInWithTwitch" class="p-1 border rounded-2xl w-64">
        Connect with Twitch
      </button>
      <div v-if="test">
        <h1>Hello World !</h1>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/",
  },
});

const test = ref(false);

const { signIn } = useAuth();

const signInWithGithub = async () => {
  await signIn("github");
  test.value = true;
};

const signInWithTwitch = async () => {
  await signIn("twitch");
};
</script>
