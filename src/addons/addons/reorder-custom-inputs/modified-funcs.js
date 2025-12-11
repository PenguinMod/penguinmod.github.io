// https://github.com/PenguinMod/PenguinMod-Blocks/blob/a92e9599ad2820ddda8b668a1d254931537be43e/blocks_vertical/procedures.js#L293
export function modifiedCreateAllInputs(connectionMap) {
  this.createIcon_()

  // Split the proc into components, by %n, %b, %s and %l (ignoring escaped).
  var procComponents = this.procCode_.split(/(?=[^\\]%[nbslc])/);
  procComponents = procComponents.map(function (c) {
    return c.trim(); // Strip whitespace.
  });

  // Create arguments and labels as appropriate.
  var argumentCount = 0;
  for (var i = 0, component; (component = procComponents[i]); i++) {
    var labelText;
    var argumentType = component.substring(1, 2);
    var id = this.argumentIds_[argumentCount];
    // Don't treat %l as an argument
    if (component.substring(0, 1) == '%' && (['n', 's', 'b', 'c'].includes(argumentType)) && id) {
      /*
      if (!(argumentType == "n" || argumentType == "b" || argumentType == "s")) {
        throw new Error("Found an custom procedure with an invalid type: " + argumentType);
      }
      */
      labelText = component.substring(2).trim();

      if (argumentType == 'c') {
        var input = this.appendStatementInput(id)
      } else {
        var input = this.appendValueInput(id);
      }
      if (argumentType == 'b') {
        input.setCheck('Boolean');
      }
      this.populateArgument_(argumentType, argumentCount, connectionMap, id,
          input);
      argumentCount++;
    } else {
      labelText = component == "%l" ? " " : component.replace("%l", "").trim();
    }
    this.addProcedureLabel_(labelText.replace(/\\%/, "%"));
  }

  // remove all traces of %l at the earliest possible time
  this.procCode_ = this.procCode_.replace(/%l /g, "");
}

//https://github.com/PenguinMod/PenguinMod-Blocks/blob/a92e9599ad2820ddda8b668a1d254931537be43e/blocks_vertical/procedures.js#L716
export function modifiedUpdateDeclarationProcCode(prefixLabels = false) {
  this.procCode_ = "";
  this.displayNames_ = [];
  this.argumentIds_ = [];
  for (var i = 0; i < this.inputList.length; i++) {
    if (i != 0) {
      this.procCode_ += " ";
    }
    var input = this.inputList[i];
    if (input.type == 5) {
      // replaced Blocky.DUMMY_VALUE with 5
      this.procCode_ += (prefixLabels ? "%l " : "") + input.fieldRow[0].getValue(); // modified to prepend %l delimiter, which prevents label merging
    } else if (input.type == 1 || input.type == 3) {
      // replaced Blocky.INPUT_VALUE with 1 and Blockly.NEXT_STATEMENT with 3
      // Inspect the argument editor.
      var target = input.connection.targetBlock();
      this.displayNames_.push(target.getFieldValue('TEXT'));
      this.argumentIds_.push(input.name);
      switch (target.type) {
        case 'argument_editor_string_number':
          this.procCode_ += '%s';
          break;
        case 'argument_editor_boolean':
          this.procCode_ += '%b';
          break;
        case 'argument_editor_command':
          this.procCode_ += "%c";
          break;
      }
    } else {
      throw new Error("Unexpected input type on a procedure mutator root: " + input.type);
    }
  }
}
