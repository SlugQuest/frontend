<script lang="ts">
	import Calendar from '@event-calendar/core';
	import TimeGrid from '@event-calendar/time-grid';
	import Interaction from '@event-calendar/interaction';

  import {getTasks} from '$lib/get_tasks';

  import type {Task} from '$lib/get_tasks';

  let tasks = getTasks();

	function _pad(num: number) {
		let norm = Math.floor(Math.abs(num));
		return (norm < 10 ? '0' : '') + norm;
	}

  type Event = {
    start: string;
    end: string;
    resourceId: number;
    display: string;
    startEditable: boolean;
    durationEditable: boolean;
    editable: boolean;
    title?: string;
    color?: string;
    allDay?: boolean;
  }

  function convert_task(task: Task): Event {
    return {
      start: task.StartTime,
      end: task.EndTime,
      resourceId: task.TaskID,
      display: 'default',
      startEditable: false,
      durationEditable: false,
      editable: false,
      title: task.TaskName,
      allDay: task.IsAllDay
    }
  }

	function gen_tasks() {
    let events = tasks.map(convert_task);

		let days = [];
		for (let i = 0; i < 7; ++i) {
			let day = new Date();
			let diff = i - day.getDay();
			day.setDate(day.getDate() + diff);
			days[i] = day.getFullYear() + '-' + _pad(day.getMonth() + 1) + '-' + _pad(day.getDate());
		}

    console.log(days[0]);
    console.log(events[0].start);

    return events;
	}

	function update_callback(info: any) {
		console.log(info);
	}

	let plugins = [TimeGrid, Interaction];
	let options = {
		view: 'timeGridWeek',
		events: gen_tasks(),
		eventDrop: update_callback
	};
</script>

<div class="m-5 p-3 rounded-lg border-2 border-gray-200">
	<Calendar {plugins} {options} />
</div>
