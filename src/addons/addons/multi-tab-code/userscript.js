/* eslint-disable */ // FUCK OFF FOR THE LOVE OF CHRIST
export default async function ({ addon, msg, console }) {
  return // !! The addon deletes blocks randomly and so can not inject itself !!
  // make migrating code between tabs possible at all
  let selectedTab = -1;
  let hoveredTab = -1;
  let dragging = false;
  const tabs = [];
  window.tabs = tabs;
  let tabTarget = null;
  const commentId = '// multi-tab configuration entry\n';
  let scroll = 0;
  let scrollSelected = false;
  let selectStartX = 0;
  let selectStartScroll = 0;
  let lastLoaded = '';
  const soup_ = '!#%()*+,-./:;=?@[]^_`{|}~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  function uid() {
    const length = 20;
    const soupLength = soup_.length;
    const id = [];
    for (let i = 0; i < length; i++) {
        id[i] = soup_.charAt(Math.random() * soupLength);
    }
    return id.join('');
  }

  const Blockly = await addon.tab.traps.getBlockly();
  // goofy i know, but it makes vscode understand so
  /** @type {import('../../../../../scratch-vm/src/index')} */
  const vm = addon.tab.traps.vm;
  const { Blocks, Variable, RenderedTarget, Comment } = vm.exports;
  const ogEmitUpdate = vm.emitWorkspaceUpdate;
  vm.emitWorkspaceUpdate = function() {
    if (!tabs[selectedTab]) return `<xml xmlns="http://www.w3.org/1999/xhtml">
                                      <variables></variables>
                                    </xml>`;
    // Create a list of broadcast message Ids according to the stage variables
    const stageVariables = this.runtime.getTargetForStage().variables;
    let messageIds = [];
    for (const varId in stageVariables) {
      if (stageVariables[varId].type === Variable.BROADCAST_MESSAGE_TYPE) {
        messageIds.push(varId);
      }
    }
    // Go through all blocks on all targets, removing referenced
    // broadcast ids from the list.
    for (let i = 0; i < this.runtime.targets.length; i++) {
      const currTarget = this.runtime.targets[i];
      const currBlocks = currTarget.blocks._blocks;
      for (const blockId in currBlocks) {
        if (currBlocks[blockId].fields.BROADCAST_OPTION) {
          const id = currBlocks[blockId].fields.BROADCAST_OPTION.id;
          const index = messageIds.indexOf(id);
          if (index !== -1) {
            messageIds = messageIds.slice(0, index)
              .concat(messageIds.slice(index + 1));
          }
        }
      }
    }
    // Anything left in messageIds is not referenced by a block, so delete it.
    for (let i = 0; i < messageIds.length; i++) {
      const id = messageIds[i];
      delete this.runtime.getTargetForStage().variables[id];
    }
    const globalVarMap = Object.assign({}, this.runtime.getTargetForStage().variables);
    const localVarMap = this.editingTarget.isStage ?
      Object.create(null) :
      Object.assign({}, this.editingTarget.variables);

    const globalVariables = Object.keys(globalVarMap).map(k => globalVarMap[k]);
    const localVariables = Object.keys(localVarMap).map(k => localVarMap[k]);
    const workspaceComments = Object.keys(this.editingTarget.comments)
        .map(k => this.editingTarget.comments[k])
        .filter(c => c.blockId === null && c.tab == selectedTab && !c.text.startsWith(commentId));

    const xmlString = `<xml xmlns="http://www.w3.org/1999/xhtml">
                        <variables>
                          ${globalVariables.map(v => v.toXML()).join()}
                          ${localVariables.map(v => v.toXML(true)).join()}
                        </variables>
                        ${workspaceComments.map(c => c.toXML()).join()}
                        ${tabs[selectedTab].scripts.map(script => vm.editingTarget.blocks.blockToXML(script, this.editingTarget.comments))}
                      </xml>`;

    this.emit('workspaceUpdate', {xml: xmlString});
  }
  const ogBlockListener = vm.blockListener;
  vm.blockListener = function(e) {
    // skip operations on comments that arnt real
    if (e.type === 'comment_delete' && tabTarget.comments[e.commentId]?.tab !== selectedTab) return;
    // do not delete blocks from other tabs, the main sprite must be a pool of all tabs
    if (e.type === 'delete' && !scriptsHasBlock(tabs[selectedTab].scripts, e.blockId)) return;
    if (e.type === 'create' && !tabs[selectedTab].scripts.includes(e.blockId))
      tabs[selectedTab].scripts.push(e.blockId);
    if (e.type === 'move' && !e.newParentId && !tabs[selectedTab].scripts.includes(e.blockId))
      tabs[selectedTab].scripts.push(e.blockId);
    if (e.type === 'move' && e.newParentId && tabs[selectedTab].scripts.includes(e.blockId)) {
      const idx = tabs[selectedTab].scripts.indexOf(e.blockId);
      tabs[selectedTab].scripts.splice(idx, 1);
    }
    if (e.type === 'delete' && tabs[selectedTab].scripts.includes(e.blockId)) {
      const idx = tabs[selectedTab].scripts.indexOf(e.blockId);
      tabs[selectedTab].scripts.splice(idx, 1);
    }
    ogBlockListener(e);

    switch (e.type) {
    case 'endDrag': 
      dragging = false;
      if (hoveredTab === -1) break;
      const blocks = vm.editingTarget.blocks.XMLToBlock(e);
      const moveNotCopy = addon.settings.get('moveOnDrag');
      for (const block of blocks) {
        const oldId = block.id;
        const newId = block.id = uid();
        // replace all instances of the old id with the new one
        blocks.forEach(block => {
          if (block.next === oldId && block.next) block.next = newId;
          if (block.parent === oldId && block.parent) block.parent = newId;
          for (const name in block.inputs) {
            const input = block.inputs[name];
            if (input.block === oldId && input.block) input.block = newId;
            if (input.shadow === oldId && input.shadow) input.shadow = newId;
          }
        });
        tabTarget.blocks.createBlock(block);
        if (moveNotCopy) {
          tabTarget.blocks.deleteBlock(oldId, true);
          if (tabs[selectedTab].scripts.includes(oldId)) {
            const idx = tabs[selectedTab].scripts.indexOf(oldId);
            tabs[selectedTab].scripts.splice(idx, 1);
          }
        }
        if (block.topLevel) tabs[hoveredTab].scripts.push(newId);
      }
      if (moveNotCopy) selectTab(hoveredTab);
    }
  }
  const workspace = Blockly.getMainWorkspace();
  // remove old, bound, function
  const func = workspace.listeners_.findIndex(func => func.name.includes(ogBlockListener.name));
  workspace.listeners_.splice(func, 1);
  const vmSaveJSON = vm.toJSON;
  vm.toJSON = function(optTargetId, serializationOptions) {
    saveTabs();
    return vmSaveJSON.call(this, optTargetId, serializationOptions);
  }
  vm.runtime._updateGlows = function(optExtraThreads) {
    const searchThreads = [];
    searchThreads.push.apply(searchThreads, this.threads);
    if (optExtraThreads) {
      searchThreads.push.apply(searchThreads, optExtraThreads);
    }
    // Set of scripts that request a glow this frame.
    const requestedGlowsThisFrame = [];
    // Final set of scripts glowing during this frame.
    const finalScriptGlows = [];
    // Find all scripts that should be glowing.
    for (let i = 0; i < searchThreads.length; i++) {
      const thread = searchThreads[i];
      const target = thread.target;
      if (target === this._editingTarget) {
        const blockForThread = thread.blockGlowInFrame;
        if (thread.requestScriptGlowInFrame || thread.stackClick) {
          let script = this._editingTarget.blocks.getTopLevelScript(blockForThread);
          if (!tabs[selectedTab].scripts.includes(script)) {
            // Attempt to find in flyout blocks.
            script = this.flyoutBlocks.getTopLevelScript(
              blockForThread
            );
          }
          if (script) {
            requestedGlowsThisFrame.push(script);
          }
        }
      }
    }
    // Compare to previous frame.
    for (let j = 0; j < this._scriptGlowsPreviousFrame.length; j++) {
      const previousFrameGlow = this._scriptGlowsPreviousFrame[j];
      if (requestedGlowsThisFrame.indexOf(previousFrameGlow) < 0) {
        this.glowScript(previousFrameGlow, false);
      } else {
        // Still glowing.
        finalScriptGlows.push(previousFrameGlow);
      }
    }
    for (let k = 0; k < requestedGlowsThisFrame.length; k++) {
      const currentFrameGlow = requestedGlowsThisFrame[k];
      if (this._scriptGlowsPreviousFrame.indexOf(currentFrameGlow) < 0) {
        // Glow turned on.
        this.glowScript(currentFrameGlow, true);
        finalScriptGlows.push(currentFrameGlow);
      }
    }
    this._scriptGlowsPreviousFrame = finalScriptGlows;
  }
  const oldDuplicate = RenderedTarget.prototype.duplicate;
  RenderedTarget.prototype.duplicate = function() {
    // !!! this may have issues in the future as duplication creates new ids
    saveTabs();
    return oldDuplicate.call(this);
  }
  RenderedTarget.prototype.createComment = function(id, blockId, text, x, y, width, height, minimized) {
    if (!this.comments.hasOwnProperty(id)) {
      const newComment = new Comment(id, text, x, y, width, height, minimized);
      newComment.tab = selectedTab;
      if (blockId) {
        newComment.blockId = blockId;
        const blockWithComment = this.blocks.getBlock(blockId);
        if (blockWithComment) {
          blockWithComment.comment = id;
        } else {
          log.warn(`Could not find block with id ${blockId} associated with commentId: ${id}`);
        }
      }
      this.comments[id] = newComment;
    }
  }
  class MutatorWrapper {
    mutation = {}
    blockId = null;
    constructor(mute, blockId) { this.mutation = mute; this.blockId = blockId; }
    getInput() { return null }
    getProcCode() { return this.mutation.proccode }
    get workspace() { return ScratchBlocks.getMainWorkspace() }
    mutationToDom(generateShadows) {
      const blocks = vm.editingTarget.blocks;
      const str = blocks.mutationToXML(this.mutation);
      const parser = new DOMParser();
      const element = parser.parseFromString(`<xml>${str}</xml>`, 'text/xml')
        .firstChild.firstChild;
      if (generateShadows)
        element.setAttribute('generateshadows', 'true');
      return element;
    }
    domToMutation(dom) {
      const blocks = vm.editingTarget.blocks;
      this.mutation = blocks.XMLToMutation(dom);
      // event isnt ever fired for whatever reason????????
      blocks._blocks[this.blockId].mutation = this.mutation;
    }
  }
  // Make procedures get sourced from the target, rather then the workspace
  const oldProcedureMutations = ScratchBlocks.Procedures.allProcedureMutations;
  ScratchBlocks.Procedures.allProcedureMutations = function(root) {
    let blockMutes = oldProcedureMutations.call(this, root);
    if (!vm.editingTarget) return blockMutes;
    blockMutes = Object.fromEntries(blockMutes.map(mutation => [mutation.getAttribute('proccode'), mutation]));
    const blocks = vm.editingTarget.blocks;
    for (const id in blocks._blocks) {
      const block = blocks._blocks[id];
      if (block.opcode === 'procedures_prototype' && !blockMutes[block.mutation.proccode]) {
        const wrapper = new MutatorWrapper(block.mutation, id);
        blockMutes[block.mutation.proccode] = wrapper.mutationToDom(true);
      }
    }
    return Object.values(blockMutes);
  }
  ScratchBlocks.Procedures.getPrototypeBlock = function(procCode, workspace) {
    var defineBlock = Blockly.Procedures.getDefineBlock(procCode, workspace);
    if (defineBlock instanceof MutatorWrapper) {
      const blocks = vm.editingTarget.blocks;
      for (const id in blocks._blocks) {
        const block = blocks._blocks[id];
        if (block.opcode === 'procedures_prototype' && block.mutation.proccode === procCode) {
          return new MutatorWrapper(block.mutation, id);
        }
      }
    }
    if (defineBlock) {
      return defineBlock.getInput('custom_block').connection.targetBlock();
    }
    return null;
  }
  const oldDefineBlock = ScratchBlocks.Procedures.getDefineBlock;
  ScratchBlocks.Procedures.getDefineBlock = function(procCode, workspace) {
    const prototype = oldDefineBlock.call(this, procCode, workspace);
    if (!prototype) {
      const blocks = vm.editingTarget.blocks;
      for (const id in blocks._blocks) {
        const block = blocks._blocks[id];
        if (block.opcode === 'procedures_prototype' && block.mutation.proccode === procCode) {
          const parent = blocks._blocks[block.parent];
          return new MutatorWrapper(parent.mutation, id);
        }
      }
    }
    return prototype;
  }
  const oldCallers = ScratchBlocks.Procedures.getCallers;
  function checkBlocks(entry, blocks, check) {
    let block;
    do {
      block = blocks.getBlock(entry);
      entry = block.next;
      check(block);
      for (const name in block.inputs) {
        const input = block.inputs[name];
        checkBlocks(input.block, blocks, check);
      }
    } while (blocks.getBlock(block.next));
  }
  ScratchBlocks.Procedures.getCallers = function(name, ws, definitionRoot, allowRecursive) {
    let callers = oldCallers.call(this, name, ws, definitionRoot, allowRecursive);
    if (!vm.editingTarget) return callers;
    callers = Object.fromEntries(callers.map(item => [item.getProcCode(), item]));
    const blocks = vm.editingTarget.blocks;
    for (const id of blocks._scripts) {
      const block = blocks._blocks[id];
      if (!allowRecursive && (block.opcode === 'procedures_definition' || block.opcode === 'procedures_definition_return')) continue;
      checkBlocks(id, blocks, block => {
        if (block.opcode === 'procedures_call') 
          callers[block.mutation.proccode] ??= new MutatorWrapper(block.mutation. block.id);
      });
    }
    return Object.values(callers);
  }
  // listen to when we start dragging blocks around
  const oldStartBlockDrag = Blockly.BlockDragger.prototype.startBlockDrag;
  Blockly.BlockDragger.prototype.startBlockDrag = function(...args) {
    dragging = true;
    return oldStartBlockDrag.call(this, ...args);
  }
  Blockly.BlockDragger.prototype.fireEndDragEvent_ = function(isOutside) {
    // make sure that xml is actually generated
    var event = new Blockly.Events.EndBlockDrag(this.draggingBlock_, true);
    // do apply the real value
    event.isOutside = isOutside;
    Blockly.Events.fire(event);
  };

  const codeTab = document.getElementById('react-tabs-1');
  const blockSpace = codeTab.getElementsByClassName('injectionDiv')[0];
  const flyout = blockSpace.getElementsByClassName('blocklyFlyout')[0];
  const toolbox = blockSpace.getElementsByClassName('blocklyToolboxDiv')[0];
  const scrollBar = document.createElement('div');
  scrollBar.classList.add('tab-scrollbar');
  const tabScroller = document.createElement('div');
  tabScroller.classList.add('tab-scroller');
  tabScroller.onmouseleave = () => hoveredTab = -1;
  const tabWrapper = document.createElement('div');
  tabWrapper.classList.add('tab-wrapper');
  tabWrapper.appendChild(tabScroller);
  tabWrapper.appendChild(scrollBar);
  (function animateBar() {
    const size = flyout.getBoundingClientRect();
    const altSize = toolbox.getBoundingClientRect();
    const boundSize = blockSpace.getBoundingClientRect();
    tabWrapper.style.width = `calc(100% - ${(Math.max(size.right, altSize.right) - boundSize.left)}px)`;
    computeScrollbar();
    requestAnimationFrame(animateBar);
  })();
  blockSpace.appendChild(tabWrapper);
  const addButton = document.createElement('img');
  addButton.src = addon.self.getResource('/add.svg');
  addButton.textContent = '+';
  addButton.classList.add('tab-adder-button');
  tabScroller.appendChild(addButton);

  function scriptsHasBlock(scripts, block) {
    const top = vm.editingTarget.blocks.getTopLevelScript(block);
    return scripts.includes(top);
  }
  function selectTab(idx) {
    const { element: tab } = tabs[idx];
    selectedTab = idx;
    for (const meta of tabs) {
      if (!meta) continue;
      const { element: tab } = meta;
      tab.classList.remove('selected');
      tab.classList.remove('unselected');
      tab.classList.add('unselected');
    }
    tab.classList.toggle('unselected');
    tab.classList.toggle('selected');
    vm.emitWorkspaceUpdate();
    // clear glows to prevent glowOff throwing errors
    vm.runtime._scriptGlowsPreviousFrame = [];
    vm.runtime._updateGlows();
  }
  function addTab(enabled, name, scripts) {
    const meta = { name: name, element: null, idx: -1, scripts: [] };
    if (scripts)
      meta.scripts = [...scripts];
    meta.idx = tabs.push(meta) -1;
    meta.name ??= `Tab ${meta.idx +1}`;
    const tabOuter = document.createElement('div');
    tabOuter.classList.add('tab-bounds');
    const tab = document.createElement('div');
    meta.element = tab;
    tab.classList.add('tab');
    tab.classList.add('unselected');
    if (enabled) selectTab(meta.idx);
    tab.textContent = meta.name;
    tabOuter.onclick = () => {
      if (meta.idx === selectedTab) {
        const res = prompt(`New name for ${meta.name}?`, meta.name);
        if (!res) return;
        meta.name = res;
        tab.textContent = meta.name;
        return;
      }
      selectTab(meta.idx);
    }
    tab.onmouseenter = () => {
      hoveredTab = meta.idx;
      if (dragging) {
        tab.classList.add('copying');
        tabOuter.classList.add('copying');
        tabWrapper.classList.add('copying');
        return;
      }
      tab.classList.add('hover');
    }
    tab.onmouseleave = () => {
      tab.classList.remove('copying');
      tabOuter.classList.remove('copying');
      tabWrapper.classList.remove('copying');
      tab.classList.remove('hover');
    }
    tabOuter.appendChild(tab);
    addButton.before(tabOuter);
    computeScrollbar();
  }
  function removeTab(idx) {
    if (tabs.length <= 1) return;
    const tab = tabs[idx];
    tab.element.parentElement.remove();
    tabs.splice(idx, 1);
    if (!tabs[selectedTab]) selectedTab--;
    const shouldntDelete = addon.settings.get('shouldDelete');
    for (const script of tab.scripts) {
      if (shouldntDelete == 'true') {
        tabs[selectedTab].scripts.push(script);
        continue;
      }
      tabTarget.blocks.deleteBlock(script);
    }
    // offset indecies
    for (const meta of tabs)
      if (meta.idx > idx)
        meta.idx--;
    selectTab(selectedTab);
    computeScrollbar();
  }
  addButton.onclick = () => addTab(true);
  function computeScrollbar() {
    scrollBar.hidden = true;
    const bodySize = tabScroller.getBoundingClientRect();
    const wrapperSize = tabWrapper.getBoundingClientRect();
    const diff = bodySize.width - wrapperSize.width;
    const len = wrapperSize.width - diff;
    if (len > wrapperSize.width) return;
    scrollBar.hidden = false;
    scrollBar.style.width = `${len}px`;
    // clamp scroll into the viewbox
    scroll = Math.max(Math.min(scroll, diff), 0);
    scrollBar.style.left = `${scroll}px`;
    tabScroller.style.left = `-${scroll}px`;
  }
  tabWrapper.onwheel = e => {
    const bodySize = tabScroller.getBoundingClientRect();
    const wrapperSize = tabWrapper.getBoundingClientRect();
    const diff = bodySize.width - wrapperSize.width;
    // prefer deltaX, otherwise use deltaY
    scroll = Math.max(Math.min((e.deltaX || e.deltaY) + scroll, diff), 0);
    scrollBar.style.left = `${scroll}px`;
    tabScroller.style.left = `-${scroll}px`;
  }
  scrollBar.onmousedown = e => {
    scrollSelected = true;
    selectStartScroll = scroll;
    selectStartX = e.x;
  }
  document.addEventListener('mouseup', () => scrollSelected = false);
  document.addEventListener('mousemove', e => {
    if (!scrollSelected) return;
    const bodySize = tabScroller.getBoundingClientRect();
    const wrapperSize = tabWrapper.getBoundingClientRect();
    const diff = bodySize.width - wrapperSize.width;
    scroll = Math.max(Math.min((e.x - selectStartX) + selectStartScroll, diff), 0);
    scrollBar.style.left = `${scroll}px`;
    tabScroller.style.left = `-${scroll}px`;
  });
  function loadTabs() {
    for (const comment of Object.values(tabTarget.comments)) {
      if (comment.text.startsWith(commentId)) {
        lastLoaded = comment.text;
        const savedTabs = JSON.parse(comment.text.slice(commentId.length));
        if (!savedTabs?.length) throw new Error('No saved tabs');
        const scripts = [...tabTarget.blocks._scripts];
        // despite this normally acting on script heads, still made this to handle any case where there are parents
        for (const blockId in tabTarget.blocks._blocks) {
          const block = tabTarget.blocks._blocks[blockId];
          if (!block.mutation?.blockId) continue;
          const oldId = block.id;
          const newId = block.id = block.mutation.blockId;
          const scriptIdx = tabTarget.blocks._scripts.indexOf(oldId);
          if (scriptIdx !== -1) tabTarget.blocks._scripts[scriptIdx] = newId;
          delete tabTarget.blocks._blocks[blockId];
          tabTarget.blocks._blocks[newId] = block;
          const next = tabTarget.blocks.getBlock(block.next);
          if (next && next.parent && next.parent === oldId) next.parent = newId;
          const parent = tabTarget.blocks.getBlock(block.parent);
          if (parent) {
            if (parent.next === oldId && parent.next && parent.next === oldId) parent.next = newId;
            else {
              for (const name in parent.inputs) {
                const input = parent.inputs[name];
                if (input.block === oldId && input.block && input.block === oldId) input.block = newId;
                if (input.shadow === oldId && input.shadow && input.shadow === oldId) input.shadow = newId;
              }
            }
          }
          for (const name in block.inputs) {
            const input = block.inputs[name];
            const oblock = tabTarget.blocks.getBlock(input.block);
            if (oblock && oblock.parent && oblock.parent === oldId) oblock.parent = newId;
            const shadow = tabTarget.blocks.getBlock(input.shadow);
            if (shadow && shadow.parent && shadow.parent === oldId) shadow.parent = newId;
          }
          if (block.topLevel) block.parent = null;
        }
        for (const tabIdx in savedTabs) {
          const tab = savedTabs[tabIdx];
          for (const cid of tab.comments)
            tabTarget.comments[cid].tab = tabIdx;
          for (const script of tab.scripts) {
            const idx = scripts.indexOf(script);
            scripts.splice(idx, 1);
          }
          addTab(tab.selected, tab.name, tab.scripts);
        }
        for (const script of scripts)
          tabs[selectedTab].scripts.push(script);
        return;
      }
    }
    throw new Error('No tab comment could be found');
  }
  function saveTabs() {
    const serial = tabs
      .filter(tab => tab.scripts.length > 0)
      .map((tab, idx) => {
        for (const script of tab.scripts) {
          if (!tabTarget.blocks._blocks[script]) {
            console.warn('Ignoring none existent block', script, 'while saving for tab', selectedTab);
            continue;
          }
          tabTarget.blocks._blocks[script].mutation ??= { children: [] };
          tabTarget.blocks._blocks[script].mutation.blockId = script;
        }
        return {
          name: tab.name,
          scripts: tab.scripts,
          selected: selectedTab === idx,
          comments: Object.values(tabTarget.comments)
            .filter(c => !c.text.startsWith(commentId) && c.tab == idx)
            .map(c => c.id)
        }
      });
    for (const comment of Object.values(tabTarget.comments))
      if (comment.text.startsWith(commentId))
        return comment.text = commentId + JSON.stringify(serial);
    tabTarget.createComment(undefined, undefined, commentId + JSON.stringify(serial), 10,10, -100000,-100000, true);
  }
  function hasCommentChanged() {
    for (const comment of Object.values(tabTarget.comments)) {
      if (comment.text === lastLoaded) return false;
    }
    return true;
  }

  vm.on('targetsUpdate', () => {
    // if editingTarget doesnt exist, tabTarget cant either
    if (!vm.editingTarget) return tabTarget = null;
    if (tabTarget && vm.editingTarget.id === tabTarget.id && !hasCommentChanged()) return;
    if (tabTarget) saveTabs();
    selectedTab = -1;
    while (tabs.length) tabs.shift();
    while (tabScroller.children.length > 1) 
      tabScroller.children[0].remove();
    tabTarget = vm.editingTarget;
    try {
      loadTabs();
    } catch (err) {
      if (err.message !== 'No saved tabs' && err.message !== 'No tab comment could be found')
        console.warn('Couldnt read the serialized tabs', err);
      addTab(true, null, vm.editingTarget.blocks._scripts);
    }
    if (selectedTab < 0 || selectedTab >= tabs.length) selectTab(0);
  });

  const keysPressed = {};
  document.addEventListener('keydown', e => {
    keysPressed[e.key] = true;
    if (keysPressed['{']) {
      if (selectedTab > 0)
        selectTab(--selectedTab);
    }
    if (keysPressed['}']) {
      if ((selectedTab +1) < tabs.length)
        selectTab(++selectedTab);
    }
    if (keysPressed['_']) {
      if (tabs.length > 1)
        removeTab(selectedTab);
    }
    if (keysPressed['+']) {
      addTab(true);
    }
  });
  document.addEventListener('keyup', e => delete keysPressed[e.key]);
}
