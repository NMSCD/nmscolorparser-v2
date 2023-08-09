import { processEXML } from '@/logic/logic';
import { defineStore } from 'pinia';

interface State {
  fileXmlDoc: XMLDocument | undefined;
}

export const useColourStore = defineStore('colours', {
  state: (): State => ({
    fileXmlDoc: undefined,

  }),

  actions: {
    readFile(e: Event) {
      const element = e.target as HTMLInputElement | null;
      if (!element?.files?.length) return;
      const file = element.files[0];

      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        const contents = e.target?.result;
        this.fileXmlDoc = typeof contents === 'string' ? processEXML(contents) : undefined;
      };
    }
  }
});
