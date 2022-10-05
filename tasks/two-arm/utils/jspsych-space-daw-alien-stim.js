/**
* jspsych-space-daw-stim
* Wouter Kool
*
* plugin for displaying a space and aliens version of the Daw 2-step task
*
**/

var jsPsychSpaceDawAlienStim = (function (jspsych) {
	'use strict';

	const info = {
      name: "space-daw-alien-stim",
      parameters: {
          /** Function to call */
          // choices: {
          //     type: jspsych.ParameterType.FUNCTION,
          //     pretty_name: "Function",
          //     default: undefined,
          // },
          // /** Is the function call asynchronous? */
          // async: {
          //     type: jspsych.ParameterType.BOOL,
          //     pretty_name: "Asynchronous",
          //     default: false,
          // },
					// parameter_name: {
					// 	type: jspsych.ParameterType.INT,
					// 	default: undefined,
					// },
					// parameter_name2: {
					// 	type: jspsych.ParameterType.IMAGE,
					// 	default: undefined,
					// },
      },
  };

	class SpaceDawAlienPlugin {
		constructor(jsPsych) {
			this.jsPsych = jsPsych;
		}

		trial(display_element, trial) {

			// if any trial variables are functions
			// this evaluates the function and replaces
			// it with the output of the function

			trial = this.jsPsych.pluginAPI.evaluateFunctionParameters(trial);

			if (Math.random()<0.5) { // left response
				position = 'left';
				other_position = 'right';
				choices = 'F';
			} else {
				position = 'right';
				other_position = 'left';
				choices = 'J';
			}

			state_name = trial.state_name;
			if (state_name == 'green') {
				var state_color = [35, 63, 39];
			}
			if (state_name == 'yellow') {
				var state_color = [240, 187, 57];
			}

			// store responses
			var setTimeoutHandlers = [];

			var keyboardListener = new Object;

			// function to end trial when it is time
			var end_trial = function() {

				kill_listeners();
				kill_timers();

				//this.jsPsych.data.write(trial_data);

				var handle_points = setTimeout(function() {
					// clear the display
					display_element.html('');
					$('.jspsych-display-element').css('background-image', '');

					// move on to the next trial
					var handle_ITI = setTimeout(function() {
						this.jsPsych.finishTrial();
					}, trial.ITI);
					setTimeoutHandlers.push(handle_ITI);
				}, trial.points_time);
				setTimeoutHandlers.push(handle_points);

			};

			// function to handle responses by the subject
			var after_response = function(info) {

				kill_listeners();
				kill_timers();

				win = Math.random()<trial.p;

				display_stimuli(2);
				var handle_feedback = setTimeout(function() {
					display_stimuli(3);
					var handle_points = setTimeout(function() {
						end_trial();
					}, trial.points_time);
					setTimeoutHandlers.push(handle_points);
				}, trial.feedback_time);
				setTimeoutHandlers.push(handle_feedback);
			}


			var display_stimuli = function(stage){

				kill_timers();
				kill_listeners();

				//state_name = state_names[state];
				//state_color = state_colors[state];


				if (stage==1) { // choice stage

					display_element.html('');

					$('.jspsych-display-element').css('background-image', 'url("img/'+state_name+'_planet.png")');

					display_element.append($('<div>', {
						id: 'jspsych-space-daw-top-stim-left',
					}));
					display_element.append($('<div>', {
						id: 'jspsych-space-daw-top-stim-middle',
					}));
					display_element.append($('<div>', {
						id: 'jspsych-space-daw-top-stim-right',
					}));

					display_element.append($('<div>', {
						style: 'clear:both',
					}));

					display_element.append($('<div>', {
						id: 'jspsych-space-daw-bottom-stim-left',
					}));
					display_element.append($('<div>', {
						id: 'jspsych-space-daw-bottom-stim-middle',
					}));
					display_element.append($('<div>', {
						id: 'jspsych-space-daw-bottom-stim-right',
					}));

					$('#jspsych-space-daw-bottom-stim-'+position).css('background-image', 'url(img/'+state_name+'_stim_1.png)');
					$('#jspsych-space-daw-bottom-stim-'+other_position).css('background-image', 'url(img/'+state_name+'_stim_2_deact.png)');

				}

				if (stage==2) { // feedback
					$('#jspsych-space-daw-bottom-stim-'+position).addClass('jspsych-space-daw-bottom-stim-border');
					$('#jspsych-space-daw-bottom-stim-'+position).css('border-color', 'rgba('+state_color[0]+','+state_color[1]+','+state_color[2]+', 1)');
				}

				if (stage==3) { // reward

					if (win==0) {
						$('#jspsych-space-daw-top-stim-'+position).css('background-image', 'url(img/noreward.png)');
						$('#jspsych-space-daw-bottom-stim-'+position).css('background-image', 'url(img/'+state_name+'_stim_1_sad.png)');
					} else {
						$('#jspsych-space-daw-top-stim-'+position).css('background-image', 'url(img/treasure.png)');
						$('#jspsych-space-daw-bottom-stim-'+position).css('background-image', 'url(img/'+state_name+'_stim_1.png)');
					}
				}
			}

			var start_response_listener = function(){
				if(JSON.stringify(trial.choices) != JSON.stringify(["none"])) {
					var keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
						callback_function: after_response,
						valid_responses: choices,
						rt_method: 'date',
						persist: false,
						allow_held_key: false
					});
				}
			}

			var kill_timers = function(){
				for (var i = 0; i < setTimeoutHandlers.length; i++) {
					clearTimeout(setTimeoutHandlers[i]);
				}
			}

			var kill_listeners = function(){
				// kill keyboard listeners
				if(typeof keyboardListener !== 'undefined'){
					this.jsPsych.pluginAPI.cancelAllKeyboardResponses();
					//this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
				}
			}

			var next_part = function(){

				kill_timers();
				kill_listeners();

				display_stimuli(1);

				start_response_listener();
			}

			next_part();
		};
	}

	return SpaceDawAlienPlugin;
})(jsPsychModule);

// (function($) {
// 	jsPsych["space-daw-alien-stim"] = (function() {
//
// 		var plugin = {};
//
// 		var score = 0;
//
// 		var displayColor = '#0738db';
// 		var borderColor = '#197bff';
// 		var textColor = '#b8fff6';
//
// 		plugin.create = function(params) {
//
// 			params = this.jsPsych.pluginAPI.enforceArray(params, ['stimuli', 'choices']);
//
// 			var trials = new Array(params.nrtrials);
//
// 			for (var i = 0; i < trials.length; i++) {
//
// 				trials[i] = {};
// 				trials[i].p = params.p;
//
// 				// timing parameters
// 				trials[i].feedback_time = params.feedback_time || 500;
// 				trials[i].ITI = params.ITI || 500;
// 				trials[i].points_time = params.points_time || 1000;
// 				trials[i].state_name = params.state_name || 'green';
// 				trials[i].score_time = params.score_time || 1000;
//
// 			}
// 			return trials;
//
// 		};
//
// 		plugin.trial = function(display_element, trial) {
//
// 			// if any trial variables are functions
// 			// this evaluates the function and replaces
// 			// it with the output of the function
//
// 			trial = this.jsPsych.pluginAPI.evaluateFunctionParameters(trial);
//
// 			if (Math.random()<0.5) { // left response
// 				position = 'left';
// 				other_position = 'right';
// 				choices = 'F';
// 			} else {
// 				position = 'right';
// 				other_position = 'left';
// 				choices = 'J';
// 			}
//
// 			state_name = trial.state_name;
// 			if (state_name == 'green') {
// 				var state_color = [35, 63, 39];
// 			}
// 			if (state_name == 'yellow') {
// 				var state_color = [240, 187, 57];
// 			}
//
// 			// store responses
// 			var setTimeoutHandlers = [];
//
// 			var keyboardListener = new Object;
//
// 			// function to end trial when it is time
// 			var end_trial = function() {
//
// 				kill_listeners();
// 				kill_timers();
//
// 				//this.jsPsych.data.write(trial_data);
//
// 				var handle_points = setTimeout(function() {
// 					// clear the display
// 					display_element.html('');
// 					$('.jspsych-display-element').css('background-image', '');
//
// 					// move on to the next trial
// 					var handle_ITI = setTimeout(function() {
// 						this.jsPsych.finishTrial();
// 					}, trial.ITI);
// 					setTimeoutHandlers.push(handle_ITI);
// 				}, trial.points_time);
// 				setTimeoutHandlers.push(handle_points);
//
// 			};
//
// 			// function to handle responses by the subject
// 			var after_response = function(info) {
//
// 				kill_listeners();
// 				kill_timers();
//
// 				win = Math.random()<trial.p;
//
// 				display_stimuli(2);
// 				var handle_feedback = setTimeout(function() {
// 					display_stimuli(3);
// 					var handle_points = setTimeout(function() {
// 						end_trial();
// 					}, trial.points_time);
// 					setTimeoutHandlers.push(handle_points);
// 				}, trial.feedback_time);
// 				setTimeoutHandlers.push(handle_feedback);
// 			}
//
//
// 		var display_stimuli = function(stage){
//
// 			kill_timers();
// 			kill_listeners();
//
// 			//state_name = state_names[state];
// 			//state_color = state_colors[state];
//
//
// 			if (stage==1) { // choice stage
//
// 				display_element.html('');
//
// 				$('.jspsych-display-element').css('background-image', 'url("img/'+state_name+'_planet.png")');
//
// 				display_element.append($('<div>', {
// 					id: 'jspsych-space-daw-top-stim-left',
// 				}));
// 				display_element.append($('<div>', {
// 					id: 'jspsych-space-daw-top-stim-middle',
// 				}));
// 				display_element.append($('<div>', {
// 					id: 'jspsych-space-daw-top-stim-right',
// 				}));
//
// 				display_element.append($('<div>', {
// 					style: 'clear:both',
// 				}));
//
// 				display_element.append($('<div>', {
// 					id: 'jspsych-space-daw-bottom-stim-left',
// 				}));
// 				display_element.append($('<div>', {
// 					id: 'jspsych-space-daw-bottom-stim-middle',
// 				}));
// 				display_element.append($('<div>', {
// 					id: 'jspsych-space-daw-bottom-stim-right',
// 				}));
//
// 				$('#jspsych-space-daw-bottom-stim-'+position).css('background-image', 'url(img/'+state_name+'_stim_1.png)');
// 				$('#jspsych-space-daw-bottom-stim-'+other_position).css('background-image', 'url(img/'+state_name+'_stim_2_deact.png)');
//
// 			}
//
// 			if (stage==2) { // feedback
// 				$('#jspsych-space-daw-bottom-stim-'+position).addClass('jspsych-space-daw-bottom-stim-border');
// 				$('#jspsych-space-daw-bottom-stim-'+position).css('border-color', 'rgba('+state_color[0]+','+state_color[1]+','+state_color[2]+', 1)');
// 			}
//
// 			if (stage==3) { // reward
//
// 				if (win==0) {
// 					$('#jspsych-space-daw-top-stim-'+position).css('background-image', 'url(img/noreward.png)');
// 					$('#jspsych-space-daw-bottom-stim-'+position).css('background-image', 'url(img/'+state_name+'_stim_1_sad.png)');
// 				} else {
// 					$('#jspsych-space-daw-top-stim-'+position).css('background-image', 'url(img/treasure.png)');
// 					$('#jspsych-space-daw-bottom-stim-'+position).css('background-image', 'url(img/'+state_name+'_stim_1.png)');
// 				}
// 			}
// 		}
//
// 		var start_response_listener = function(){
// 			if(JSON.stringify(trial.choices) != JSON.stringify(["none"])) {
// 				var keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
// 					callback_function: after_response,
// 					valid_responses: choices,
// 					rt_method: 'date',
// 					persist: false,
// 					allow_held_key: false
// 				});
// 			}
// 		}
//
// 		var kill_timers = function(){
// 			for (var i = 0; i < setTimeoutHandlers.length; i++) {
// 				clearTimeout(setTimeoutHandlers[i]);
// 			}
// 		}
//
// 		var kill_listeners = function(){
// 			// kill keyboard listeners
// 			if(typeof keyboardListener !== 'undefined'){
// 				this.jsPsych.pluginAPI.cancelAllKeyboardResponses();
// 				//jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
// 			}
// 		}
//
// 		var next_part = function(){
//
// 			kill_timers();
// 			kill_listeners();
//
// 			display_stimuli(1);
//
// 			start_response_listener();
// 		}
//
// 		next_part();
// 	};
// 
// 	return plugin;
//
// })();
// })(jQuery);
