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

interface PaletteData {
  name: string;
  data: ColourData[];
}

const allColourSections = computed(() => {
  const sections = fileXmlDoc.value?.querySelectorAll('[value="Colour.xml"]');
  if (!sections) return [];

  const data: PaletteData[][] = [];

  let prevElement: Element;

  for (const section of Array.from(sections)) {
    const colourName =
      section.getAttribute('name') ?? section.closest('[value="GcPaletteData.xml"]')?.getAttribute('name');

    if (!colourName) continue;

    const parent = section.parentElement!;

    const paletteData: PaletteData = {
      name: colourName,
      data: [],
    };

    const isSameParent = parent === prevElement!;

    if (!isSameParent) {
      data.push([paletteData]);
    }

    const matchingSection = data[data.length - 1].find((item) => item.name === colourName);

    const colourObj = !isSameParent ? paletteData : matchingSection ?? paletteData;

    if (!matchingSection) data[data.length - 1].push(paletteData);

    const children = section.children;
    const colourData: ColourData = {
      R: getColourValue(children[0]),
      G: getColourValue(children[1]),
      B: getColourValue(children[2]),
      A: getColourValue(children[3]),
    };

    colourObj.data.push(colourData);
    prevElement = parent;
  }

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

const getBackgroundColour = (colourObj: ColourData) =>
  `rgba(${colourObj.R}, ${colourObj.G}, ${colourObj.B}, ${colourObj.A})`;
</script>

<template>
  <div class="colour-wrapper">
    <div
      v-for="colourSection in allColourSections"
      class="colour-section"
    >
      <div
        v-for="(dataObj, dataIndex) in colourSection"
        :class="{ 'colour-list': dataObj.data.length !== 64 }"
        class="colour-item"
      >
        <div class="colour-name">
          {{ dataObj.name }}
        </div>
        <div :class="{ 'colour-grid': dataObj.data.length === 64 }">
          <div
            v-for="(colourObj, index) in dataObj.data"
            :style="{ 'background-color': getBackgroundColour(colourObj) }"
            class="colour-box"
          >
            {{ (dataObj.data.length === 64 ? index : dataIndex) + 1 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$size: 2rem;

.colour-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
}

.colour-section {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: 0.25rem;
}

.colour-grid,
.colour-list {
  border: 1px solid var(--color);
}

.colour-grid {
  display: grid;
  grid-template-columns: repeat(8, auto);
}

.colour-list {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
}

.colour-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: $size;
  aspect-ratio: 1;
  color: white;
  text-shadow:
    1px 1px 1px #1d1d1d,
    -1px 1px 1px #1d1d1d,
    -1px -1px 1px #1d1d1d,
    1px -1px 1px #1d1d1d;
}
</style>
