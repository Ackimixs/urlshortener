import mitt from "mitt";

export default defineNuxtPlugin(() => {
  const emitter = mitt();

  return {
    provide: {
      event: {
        $on: emitter.on,
        $emit: emitter.emit,
      },
    },
  };
});
