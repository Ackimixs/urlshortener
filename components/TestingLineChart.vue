<template>
  <div>
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
<script setup>
import { Line } from "vue-chartjs";

const chartData = ref({
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Data One",
      backgroundColor: "#f87979",
      data: [40, 39, 10, 40, 39, 80, 40],
    },
  ],
});
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});
</script>
