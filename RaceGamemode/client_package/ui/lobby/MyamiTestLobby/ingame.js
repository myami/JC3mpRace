var InGame = new Vue({
    el: '#Ingame',
    data: {
      StartTimer : 30,
      isTTS:false,
      RaceTimer: 0,
      RaceTime:{
        Seconds:0,
        Minutes:0,
        Hour:0,
      },
      TotalOfCheckpoint:0,
      CurrentCheckpoint:0
    },
    methods: {

    }

});

    jcmp.AddEvent('Countdown_start', function() {
    toggleContainer("TimerContainer", true);
      let inter = setInterval(function() {
        if (InGame.StartTimer > 0) {
          InGame.StartTimer--;
        }
        if (InGame.StartTimer == 15) {
      

        //  jcmp.CallEvent('AddPlayerLeaderboard');
        console.log("15 seconds");
        }
        if (InGame.StartTimer == 0) {
          if (!InGame.isTTS) {
            jcmp.CallEvent('race_countdown_end');
            InGame.RaceTimer = 0;
            countdownrace(true);
          } else {
            console.log("RaceisTTS");
            jcmp.CallEvent('TTS_race_countdown_end');
            InGame.RaceTimer = 0;
            countdownrace(true);
          }
          InGame.StartTimer = 30;
          clearInterval(inter);
          //document.getElementById("timer").innerText = "GO";
          setTimeout(function() {
          //  document.getElementById("timer").innerText = "";
            toggleContainer("TimerContainer", false);
          }, 2000);
        }

      }, 1000);


    });
    jcmp.AddEvent('IsTTS', function(status) {
      istts = status;
    });

    function countdownrace(status) {
      console.log("Countdown" + status);
      toggleContainer("timergame", status);
      if (status) {
        timers = setInterval(function() {
          InGame.RaceTimer++;
          InGame.RaceTime.Seconds = InGame.RaceTimer % 60;
          InGame.RaceTime.Minutes = Math.floor(InGame.RaceTimer / 60);
          InGame.RaceTime.Hour = Math.floor(InGame.RaceTimer / 3600);

        }, 1000);
      } else {
        clearInterval(timers);
        jcmp.CallEvent('Timer_Client', InGame.RaceTimer);
        console.log("TimerFinish" + InGame.RaceTimer);
        setTimeout(function() {
            toggleContainer("timergame", false);
          InGame.RaceTimer = 0;

        }, 2000);
      }
    }
    jcmp.AddEvent('Stop_Timer', function() {
      countdownrace(false);
    });

    jcmp.AddEvent('Checkpoint_Sound', () => {
      var x = document.createElement("AUDIO");
      x.setAttribute("src", "./music/CheckpointSound.ogg");
      x.setAttribute("duration", "1.23");
      x.play();

    });

    jcmp.AddEvent('Race_Checkpoint_container', function(status) {
      toggleContainer("CheckpointContainer", status);

    });

    jcmp.AddEvent('Checkpointmax', function(checkpointlength) { // the racecheckpoint.lenght
      InGame.TotalOfCheckpoint = checkpointlength;
    });


    jcmp.AddEvent('CheckpointCurrent', function(checkpoint) { // the player index checkpoint
      InGame.CurrentCheckpoint = checkpoint;
    });

    jcmp.AddEvent('WarningBarrel_CEF', function() {
      toggleContainer("WarningBarrel", true);
      setTimeout(function() {
        toggleContainer("WarningBarrel", false);
      }, 3000);
    });

    function toggleContainer(container, status) {
      // Status true = SHOW, false = HIDE
        if (status) {
          $("#" + container).show();
        } else {
          $("#" + container).hide();
        }
    }

    let $chat_input_visible = false;
    let $is_text_key_down = true;
    jcmp.AddEvent('chat_input_state', function(b) {
      $chat_input_visible = b;
    });

    $(window).keyup(function(event) {

      const key = event.which;
      //  if (key === 32) {event.preventDefault();}

      if (key === 77 && $is_text_key_down && !$chat_input_visible) { // m
        toggleContainer("Onclickexplained", false);
        $is_text_key_down = false;
      } else if (key === 66 && !$chat_input_visible) { //b
        jcmp.CallEvent('ResetPlayer_client');
      }
    });
