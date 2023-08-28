<template>
  <div>
    <div
      class="flex flex-row justify-center text-3xl tracking-widest border-black border-b-2 pb-3"
    >
      <NuxtLink to="/">DASHBOARD</NuxtLink>
    </div>

    <div>
      <div class="m-20 p-10 border border-slate-950 flex flex-col gap-8">
        <h1 class="text-xl tracking-widest pl-5">CREATOR</h1>
        <div class="flex flex-row bg-slate-600 rounded-lg">
          <p
            class="m-auto font-semibold text-gray-300"
            :class="
              longUrlError ? 'animate-shake text-red-500' : 'text-gray-300'
            "
          >
            https://
          </p>
          <input
            type="text"
            placeholder="Example: youtube.com"
            class="w-10/12 h-12 p-2 rounded-r-lg bg-gray-600"
            v-model="longUrl"
            @input="longUrlError = false"
          />
        </div>
        <div class="flex flex-row h-12">
          <div
            class="basis-2/3 flex flex-row content-center flex-wrap bg-slate-600 rounded-lg"
          >
            <p
              class="m-auto font-semibold"
              :class="
                customIdError ? 'animate-shake text-red-500' : 'text-gray-300'
              "
            >
              {{ domainName }}
            </p>
            <input
              type="text"
              placeholder="youtube"
              class="w-9/12 p-2 h-full rounded-r-lg bg-gray-600"
              @focusout="checkAvailability"
              @input="customIdError = false"
              v-model="customId"
            />
          </div>
          <div class="basis-1/3 flex justify-center">
            <button class="custom-btn" @click="handleTransform">Short</button>
          </div>
        </div>
        <div class="flex flex-row">
          <p>{{ result }}</p>
        </div>
      </div>
      <div
        class="m-20 p-10 border border-slate-950 h-80 overflow-y-auto hide_scrollbar"
      >
        <p class="text-xl tracking-widest pl-5">DASHBOARD</p>
        <div v-for="url in myUrl.body.data" :key="url.id">
          <DashboardUrl :url="url" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { $event } = useNuxtApp();

const requestUrl = useRequestURL();

const domainName = ref(`${requestUrl.host}/`);

const result = ref("Result");

const longUrl = ref("");

const customId = ref("");

const customIdError = ref(false);

const longUrlError = ref(false);

const { data: myUrl, refresh } = await useFetch("/api/url/user", {
  method: "GET",
});

$event.$on("refreshDashboard", () => {
  refresh();
});

const handleTransform = async () => {
  const text = `https://${longUrl.value}`;

  if (!isUrl(text)) {
    console.log("not url");
    longUrlError.value = true;
    return;
  }

  if (requestUrl.hostname === new URL(text).hostname) {
    console.log("recursive url, i don't like it");
    longUrlError.value = true;
    return;
  }

  if (customId.value.length > 0) {
    // check if the id already exists and if the user owns it
    const { data: exists } = await useFetch("/api/url", {
      method: "GET",
      query: {
        path: customId.value,
      },
    });

    if (exists.value.body.data) {
      console.log("not available");
      customIdError.value = true;
      return;
    }
  }

  const { data: url } = await useFetch("/api/url", {
    method: "POST",
    body: {
      url: text,
      path: customId.value.length > 0 ? customId.value : undefined,
    },
  });

  if (url.value?.body?.data?.id) {
    result.value = `You can now use : ${requestUrl.host}/${url.value.body.data?.path}`;
  }

  $event.$emit("refreshDashboard");
};

const checkAvailability = async () => {
  if (customId.value.length === 0) {
    return;
  }

  if (customId.value.includes(" ")) {
    customIdError.value = true;
    return;
  }

  const { data: exist } = await useFetch("/api/url", {
    method: "GET",
    query: {
      path: customId.value,
    },
  });

  if (exist.value.body?.data) {
    console.log("not available");
    customIdError.value = true;
  } else {
    customIdError.value = false;
  }
};
</script>

<style>
/* Hide scrollbar for Chrome, Safari and Opera */
.hide_scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.hide_scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
