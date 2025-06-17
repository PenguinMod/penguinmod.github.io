export default async function ({ addon }) {
  addon.tab.traps.vm.setCompilerOptions({
    enabled: false
  });
}
