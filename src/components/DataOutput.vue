<script setup lang="ts">
import { useColourStore } from '@/stores/colours';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const colourStore = useColourStore();
const { fileXmlDoc } = storeToRefs(colourStore);

interface ColourData {
  R: number;
  G: number;
  B: number;
  A: number;
}

const allColourSections = computed(() => {
  const sections = fileXmlDoc.value?.querySelectorAll('[value="Colour.xml"]');
  if (!sections) return [];
  const data: ColourData[] = [];

  for (const section of Array.from(sections)) {
    const children = section.children;
    const dataObj = {
      R: getColourValue(children[0]),
      G: getColourValue(children[1]),
      B: getColourValue(children[2]),
      A: getColourValue(children[3]),
    };

    data.push(dataObj);
  }
  console.log(data.length);
  return data;
});

function getColourValue(element: Element) {
  const val = element.getAttribute('value');
  const colour = element.getAttribute('name');
  if (!val || !colour) return 0;
  const multiplier = colour === 'A' ? 1 : 255; // NoSonar maximum RGB colour value in CSS, 1 is maximum alpha value

  const colourVal = parseFloat(val) * multiplier;
  return colourVal;
}
</script>

<template>
  <div>Results:</div>

  <div :class="allColourSections.length === 64 ? 'grid' : 'list'">
    <div
      v-for="(dataObj, index) in allColourSections"
      :style="{ 'background-color': `rgba(${dataObj.R}, ${dataObj.G}, ${dataObj.B}, ${dataObj.A})` }"
    >
      {{ index + 1 }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.grid {
  --size: 2rem;
  display: grid;
  grid-template-columns: repeat(8, var(--size));

  & > * {
    display: flex;
    justify-content: center;
    align-items: center;
    height: var(--size);
  }
}

.list {
  --size: 2rem;
  display: grid;
  grid-template-columns: 2rem;
  & > * {
    display: flex;
    justify-content: center;
    align-items: center;
    height: var(--size);
  }
}
</style>
