<template>
  <div class="flex flex-row justify-evenly bg-slate-500 rounded-xl p-1 m-4">
    <input
      type="text"
      placeholder="custom id"
      class="bg-transparent w-2/6"
      :class="error ? 'animate-shake text-red-500' : ''"
      v-model="url.path"
    />
    <IconsArrowForward class="m-auto" color="white" height="40" />
    <input
      type="text"
      placeholder="long url"
      class="bg-transparent w-2/6"
      :class="error ? 'animate-shake text-red-500' : ''"
      v-model="url.OriginUrl"
    />
    <div class="flex flex-row justify-evenly w-3/12">
      <button class="bg-slate-400 rounded-xl p-4" @click="modifyUrl(url)">
        Modify
      </button>
      <button class="bg-slate-400 rounded-xl p-4" @click="deleteUrl(url)">
        Delete
      </button>
      <NuxtLink
        :to="url.OriginUrl"
        target="_blank"
        class="bg-slate-400 rounded-xl p-4"
      >
        View
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const { $event } = useNuxtApp();

const domain = useRequestURL();

const props = defineProps({
  url: {
    type: Object,
    required: true,
  },
});

const { url } = toRefs(props);

const error = ref(false);

const based = {
  path: url.value.path,
  OriginUrl: url.value.OriginUrl,
};

const modifyUrl = async () => {
  if (!url.value.path || !url.value.OriginUrl) {
    return reset();
  }

  if (url.value.path.includes(" ")) {
    return reset();
  }

  if (!isUrl(url.value.OriginUrl)) {
    return reset();
  }

  if (new URL(url.value.OriginUrl).hostname === domain.hostname) {
    return reset();
  }

  await useFetch("/api/url", {
    method: "PUT",
    query: {
      path: url.value.path,
      origin_url: url.value.OriginUrl,
      id: url.value.id,
    },
  });

  $event.$emit("refreshDashboard");
};

const deleteUrl = async () => {
  await useFetch("/api/url", {
    method: "DELETE",
    query: {
      id: url.value.id,
    },
  });

  $event.$emit("refreshDashboard");
};

const reset = () => {
  url.value.path = based.path;
  url.value.OriginUrl = based.OriginUrl;
  error.value = true;
  setTimeout(() => {
    error.value = false;
  }, 1500);
};
</script>
