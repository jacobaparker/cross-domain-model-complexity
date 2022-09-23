var nrpracticetrials = 25;
var nrtrials = 125;
var nralienstrials = 20;

// set up variables as
var max = 0.75;
var min = 0.25;
var sd = 0.025;

if (Math.random() > .5) {
	if(Math.random() > .5) {
		var p_ps = [0.6, 0.4];
	} else {
		var p_ps = [0.4, 0.6];
	}
	if(Math.random() > .5) {
		p_ps = [p_ps, [0.25, 0.75]];
	} else {
		p_ps = [p_ps, [0.75, 0.25]];
	}
} else {
	if(Math.random() > .5) {
		var p_ps = [0.25, .75];
	} else {
		var p_ps = [0.75, 0.25];
	}
	if(Math.random() > .5) {
		p_ps = [p_ps, [0.4, 0.6]];
	} else {
		p_ps = [p_ps, [0.6, 0.4]];
	}
}

if (Math.random() > .5) {
	if(Math.random() > .5) {
		var ps = [0.6, 0.4];
	} else {
		var ps = [0.4, 0.6];
	}
	if(Math.random() > .5) {
		ps = [ps, [0.25, 0.75]];
	} else {
		ps = [ps, [0.75, 0.25]];
	}
} else {
	if(Math.random() > .5) {
		var ps = [0.25, .75];
	} else {
		var ps = [0.75, 0.25];
	}
	if(Math.random() > .5) {
		ps = [ps, [0.4, 0.6]];
	} else {
		ps = [ps, [0.6, 0.4]];
	}
}

var gaussian = [];
for (i = 0; i < 1000; i++) {
	gaussian[i] = createMemberInNormalDistribution(0,sd);
}

var p_alien_1_ps = [1, 1, 1, 0, 1];
var p_alien_2_ps = [0, 1, 0, 0, 0];

var sex = '';
var age = 0;
var score = 0;

var subid = '';

// var change_colors = {
// 	type: jsPsychCallFunction,
// 	func: function(){
// 		$('.jspsych-display-element').css('background-color', 'black');
// 		$('.jspsych-display-element').css('color', 'white');
// 	}
// }
// var change_colors_back = {
// 	type: jsPsychCallFunction,
// 	func: function(){
// 		$('.jspsych-display-element').css('background-color', 'white');
// 		$('.jspsych-display-element').css('color', 'black');
// 	}
// }

var instructions_1a_text = function(){
	var instructions = ["<div align=center>Welcome to this HIT!<br><br>Please read all following instructions very carefully.<br><br>It takes some time, but otherwise you will not know what to do.</div>",
	"<div align=center>In this HIT, you will be taking a spaceship from earth<br> to look for space treasure on two different planets:<br><br><img style='margin:0px auto;display:block;height:200px' src='img/example_planets.png'/></div>",
	"<div align=center>Each planet has two aliens on it and each alien has its own space treasure mine.<br><br><img style='margin:0px auto;display:block;height:100px' src='img/example_aliens.png'/><br>Once you arrive to each planet, you will ask one of the aliens for space treasure from its mine.</div>",
	"<div align=justify>These aliens are nice, so if an alien just brought treasure up from the mine, it will share it with you. Space treasure looks like this:<br><br><img style='margin:0px auto;display:block' src='img/treasure.png'/><br>Sometimes, the alien will not bring up any treasure and you'll see an empty circle:<br><br><img style='margin:0px auto;display:block' src='img/noreward.png'/></div>",
	"<div align=justify>If an alien has a good mine, it means it can easily dig up space treasure and it will be very likely to have some to share. It might not have treasure every time you ask, but it will most of the time.<br><br>Another alien might have a bad mine that is hard to dig through at the moment and won't have treasure to share most times you ask.<br><br>At the end of each trial, the space treasure that you earned will be converted to points.<br><Br>Each piece of space treasure will be worth one point.</div>",
	"<div align=justify>On each planet, you can choose the left alien by pressing the 'F' key and the right alien by pressing the 'J' key. You will then see whether you got treasure.<br><br>Try practicing this a few times. In the following practice phase, always pick the alien that is highlighted.</div>"];
	return instructions
};

var instructions_1a_block = {
	type: jsPsychInstructions,
	pages: instructions_1a_text(),
	key_forward: "j",
	key_backward: "f",
	show_clickable_nav: true,
}

// timeline.push(change_colors)
timeline.push(instructions_1a_block)

var alien_1_practice_block = {
	type: jsPsychSpaceDawAlienStim,
	choices: "space",
	p: function() {
		return p_alien_1_ps.splice(0,1)
	},
	timing_post_trial: 0,
	nrtrials: 5,
};
timeline.push(alien_1_practice_block)

// experiment.push(change_colors);
// experiment.push(check_id_block);
// experiment.push(consent_block);
// experiment.push(welcome_block);
// experiment.push(instructions_1a_block);
// experiment.push(alien_1_practice_block);
// experiment.push(instructions_1b_block);
// experiment.push(alien_2_practice_block);
// experiment.push(instructions_1c_block);
// experiment.push(aliens_practice_block);
// experiment.push(instructions_1d_block);
// experiment.push(space_practice_block);
// experiment.push(instructions_2_block);
// experiment.push(space_block);
// experiment.push(save_data_block);
// experiment.push(check_demographics_block);
// experiment.push(save_subinfo_block);
// experiment.push(debriefing_block);
// experiment.push(score_block);
// experiment.push(change_colors_back);
// experiment.push(end_block);
