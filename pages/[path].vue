<template>
  <div>
    <h1>Redirecting ...</h1>
  </div>
</template>

<script setup>
definePageMeta({ auth: false });

const route = useRoute();

const path = route.params?.path;

const { data: url } = await useFetch("/api/url", {
  method: "GET",
  query: {
    path,
  },
});

if (url.value?.body?.data?.OriginUrl) {
  await useFetch("/api/traffic", {
    method: "POST",
    body: {
      path,
    },
  });

  await navigateTo(url.value.body.data.OriginUrl, { external: true });
} else {
  await navigateTo({
    path: "/",
    query: {
      error: "404",
    },
  });
}
</script>
