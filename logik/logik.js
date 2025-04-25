$(document).ready(function () {
  $('input[name="colors"]:checked').val();
  $('input[name="repeats"]:checked').val();
  $('input[name="length"]:checked').val();
  $('input[name="position"]:checked').val();

  //settings
  let color_num = 5;
  let repeats = false;
  let slot_num = 4;
  let exact = true;

  //generated answer
  let answer = [];

  //color selected
  let selected = 0;

  //row # and row colors
  let row = 0;
  let row_clicked = [];

  let colors = ["red", "green", "blue", "yellow", "purple", "orange", "pink", "cyan"];

  $('input[type=radio][name=colors]').change(function() {
      color_num = parseInt(this.value);
      reset();
  });
  $('input[type=radio][name=repeats]').change(function() {
      repeats = this.value == "yes";
      reset();
  });
  $('input[type=radio][name=length]').change(function() {
      slot_num = parseInt(this.value);
      reset();
  });
  $('input[type=radio][name=position]').change(function() {
      exact = this.value == "exact";
      reset();
  });

  //reset board for a new game
  function reset() { 
      generate();
      row = 0;
      let board = "";
      $(".answer").text("");
      //generating board based on settings
      for (let i = 0; i < 10; i++) {
          board += '<div class="row">';
          for (let j = 0; j < slot_num; j++) {
              board += '<div class="slot"></div>';
          }
          board += '</div>';
      }
      $(".board").html(`
          <div class="player">
              ${board}
          </div>
          <div class="answers">
              ${board}
          </div>
      `);
      $(".color-picker .row").html(`
          ${colors.map((color, index) => index < color_num ? `<div class="slot ${color}"></div>` : null).join("")}
      `);

      clearRow();

      //color selection
      $('.color-picker .slot').click(function(e) {
          e.preventDefault();
          selected = colors.indexOf($(this).attr("class").split(/\s+/)[1]);
      });

      //placing color
      $('.player .slot').click(function(e) {
          e.preventDefault();
          if ($(this).parent().index() == row) {
              $(this).removeClass($(this).attr("class").split(/\s+/)[1]);
              $(this).addClass(colors[selected]);
              row_clicked[$(this).index()] = selected;
          }
      });
  }

  //Send button functionality
  function send() {
      let all = true;
      for (let i = 0; i < slot_num; i++) {
          if (row_clicked[i] === false) {
              all = false;
              break;
          } 
      }
      if (all) {
          reveal();
          row++;
          clearRow();
          if (row > 9) loose();
      }
  }

  //generates answer
  function generate() {
      let colors_len = color_num;
      let color_indexes = [...Array(colors_len).keys()];
      answer = [];
      for (let i = 0; i < slot_num; i++) {
          if (repeats) {
              answer.push(color_indexes[Math.floor(Math.random() * color_num)]);
          } else {
              answer.push(color_indexes.splice(Math.floor(Math.random() * colors_len), 1)[0]);
              colors_len--;
          }
      }
  }

  //shows black and white tiles
  function reveal() {
      let all_black = true;
      //If exact place setting is enabled
      if (exact) {
          let answer_copy = [...answer];
          for (let i = 0; i < slot_num; i++) {
              let el = $(`.answers .row:nth-child(${row + 1}) .slot:nth-child(${i + 1})`); //selecting according slot
              if (row_clicked[i] == answer[i]) {
                  el.css("background", "black"); //sets to black if equal
                  answer_copy[i] = -1; // removes from next search (if there is one red in the answer and you guess all red, only one black and no whites will be placed)
              }
          }
          //we first searched for exact matches so they dont get removed before their index is checked
          for (let i = 0; i < slot_num; i++) {
              if (answer_copy[i] == -1) continue;
              let el = $(`.answers .row:nth-child(${row + 1}) .slot:nth-child(${i + 1})`);
              if (answer_copy.includes(row_clicked[i])) {
                  el.css("background", "white"); //sets to white if answer includes
                  answer_copy.splice(answer_copy.indexOf(row_clicked[i]), 1);
                  all_black = false;
              } else all_black = false;
          }
      } else {
          let black = 0;
          let white = 0;
          let answer_copy = [...answer];

          
          for (let i = 0; i < slot_num; i++) { //checking for exact matches
              if (row_clicked[i] == answer[i]) {
                  black++;
                  answer_copy[i] = -1; // The same logic
                  row_clicked[i] = -2;
              } 
          }
          
          for (let i = 0; i < slot_num; i++) { //checking for not exact matches
              if (answer_copy.includes(row_clicked[i])) {
                  let index = answer_copy.indexOf(row_clicked[i]);
                  answer_copy[index] = -1;
                  white++;
                  all_black = false;
              }
          }

          console.log(answer_copy, black, white);

          for (let i = 0; i < slot_num; i++) { //placing on board
              let el = $(`.answers .row:nth-child(${row + 1}) .slot:nth-child(${i + 1})`);
              if (i < black) el.css("background", "black");
              else if (i < black + white) el.css("background", "white");
              else all_black = false;
          }
      }

      if (all_black) win();
  }

  //Buttons actions
  $(".show-answer").click(() => {
      let a = answer.map((color, i) => colors[color]).join();
      console.log(a);
      $(".answer").text(a)
  })
  $(".reset").click(() => {
      reset();
  })
  $(".send").click(() => {
      send();
  })
  $(".show-settings").click(() => {
      $(".settings").toggle();
  })

  function win() {
      $(".board").html("<div class='winner'>Vyhráli jste!</div>");
      let selector = $(`.stats p:nth-child(${row + 2}) span`);
      selector.text(parseInt(selector.text()) + 1);
  }

  function loose() {
      $(".board").html("<div class='winner'>Prohráli jste.</div>");
  }

  //new row after reveal
  function clearRow() {
      row_clicked = [];
      for (let i = 0; i < slot_num; i++) {
          row_clicked.push(false);
      }
  }

  $("html").keypress((e) => {
      if (e.keyCode == '13') {
          send();
          return;
      } 
      let num = e.keyCode - 49;
      if (num >= 0 && num < color_num) {
          selected = num;
      }
  })

  $(".settings").toggle();
  reset();
});
5