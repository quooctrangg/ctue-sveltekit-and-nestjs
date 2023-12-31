<script lang="ts">
	import type { PageData } from './$types';
	import { onDestroy, onMount } from 'svelte';

	import correctWord from '$lib/assets/icons/games/correct-word.png';
	import tree from '$lib/assets/icons/topics/tree.png';
	import social from '$lib/assets/icons/topics/social.png';
	import animal from '$lib/assets/icons/topics/animal.png';
	import academy from '$lib/assets/icons/topics/academy.png';
	import body from '$lib/assets/icons/topics/body.png';
	import color from '$lib/assets/icons/topics/color.png';
	import clothes from '$lib/assets/icons/topics/clothes.png';
	import culture from '$lib/assets/icons/topics/culture.png';
	import entertainment from '$lib/assets/icons/topics/entertainment.png';
	import exciting from '$lib/assets/icons/topics/exciting.png';
	import family from '$lib/assets/icons/topics/family.png';
	import flag from '$lib/assets/icons/topics/flag.png';
	import food from '$lib/assets/icons/topics/food.png';
	import health from '$lib/assets/icons/topics/health.png';
	import hobby from '$lib/assets/icons/topics/hobby.png';
	import ielts from '$lib/assets/icons/topics/ielts.png';
	import job from '$lib/assets/icons/topics/job.png';
	import nature from '$lib/assets/icons/topics/nature.png';
	import others from '$lib/assets/icons/topics/others.png';
	import skill from '$lib/assets/icons/topics/skill.png';
	import spirituality from '$lib/assets/icons/topics/spirituality.png';
	import sport from '$lib/assets/icons/topics/sport.png';
	import technology from '$lib/assets/icons/topics/technology.png';
	import toeic from '$lib/assets/icons/topics/toeic.png';
	import travel from '$lib/assets/icons/topics/travel.png';

	import { goto } from '$app/navigation';
	import { toasts, ToastContainer, FlatToast } from 'svelte-toasts';
	import { CONFUSING_LIST, DELAY_ANSWER } from '../../../constants/practice';
	import PracticeResult from '../../../components/PracticeResult.svelte';
	import RightIcon from '../../../components/RightIcon.svelte';
	import WrongIcon from '../../../components/WrongIcon.svelte';
	import { HandlerSpeaker } from '$lib/store';

	type Types = { id: number; name: string; isWord: boolean };
	type Levels = { id: number; name: string };
	type Specializations = { id: number; name: string };
	type Topics = { id: number; name: string; isWord: boolean; selected: boolean; image: string };

	let myModal4: HTMLDialogElement;

	export let data: PageData;

	onMount(() => {
		myModal4.showModal();
	});

	const imgTopics: { [key: string]: string } = {
		tree,
		social,
		animal,
		academy,
		body,
		color,
		clothes,
		culture,
		entertainment,
		exciting,
		family,
		flag,
		food,
		health,
		hobby,
		ielts,
		job,
		nature,
		others,
		skill,
		spirituality,
		sport,
		technology,
		toeic,
		travel
	};

	let topics: Topics[] = [];
	let types: Types[] = [];
	let levels: Levels[] = [];
	let specializations: Specializations[] = [];
	let showTopics = false;
	let selected: {
		topics: number[];
		type: number | null;
		level: number | null;
		specialization: number | null;
		numSentence: number | null;
	} = {
		topics: [],
		type: null,
		specialization: null,
		level: null,
		numSentence: 10
	};

	let words: any[] = [];

	$: {
		if (data.topicsWord) topics = data.topicsWord;
		if (data.typesWord) types = data.typesWord;
		if (data.specializations) specializations = data.specializations;
		if (data.levels) levels = data.levels;
	}

	$: if (topics) {
		selected.topics = [];
		topics.forEach((i) => {
			if (i.selected) selected.topics.push(i.id);
		});
	}

	function toggleSelected(index: number) {
		topics[index].selected = !topics[index].selected;
	}

	let wordPack: any[] = [];
	let errMinNum = false;
	let state: any = {
		current: 0,
		nRight: 0,
		nWrong: 0,
		status: 0,
		answerList: [],
		answerIndex: -1
	};

	async function getWordPack(
		type: any,
		level: any,
		specialization: any,
		topics: any[],
		numSentence: any
	) {
		if (numSentence < 5) {
			errMinNum = true;
			return;
		}
		const topicsString = topics.map((topic) => `topic=${encodeURIComponent(topic)}`).join('&&');
		const response = await fetch(
			`/practice/correct-word?numSentence=${numSentence}&&specialization=${specialization}&&level=${level}&&type=${type}&&${topicsString}`,
			{
				method: 'GET'
			}
		);
		const result = await response.json();
		if (result.data) {
			myModal4.close();
			words = result.data;
			wordPack = randomWordQuestionPack(words, words.length);
			state = {
				current: 0,
				nRight: 0,
				nWrong: 0,
				status: 0,
				answerList: wordPack?.length
					? shuffleAnswers(wordPack[0]?.word, wordPack[0]?.phonetic, wordPack[0]?.wrongList)
					: [],
				answerIndex: -1
			};
		} else if (result.error) {
			toasts.add({
				title: 'Lỗi',
				description: result.error,
				duration: 1500,
				placement: 'top-right',
				type: 'error',
				theme: 'dark',
				showProgress: true,
				onClick: () => {},
				onRemove: () => {
					goto('/login');
				}
			});
		} else {
			toasts.add({
				title: 'Lỗi',
				description: result.message,
				duration: 1500,
				placement: 'top-right',
				type: 'error',
				theme: 'dark',
				showProgress: true,
				onClick: () => {},
				onRemove: () => {}
			});
			return;
		}
	}

	const generateWrongWordList = (
		word: string = '',
		synonyms: [] = [],
		list: any[] = [],
		isCheck: boolean = false
	) => {
		const n: number = list.length;
		if (!n || n <= 3) {
			return [];
		}
		const filteredList = isCheck ? list : list.filter((i: any) => i.content !== word);
		if (synonyms && synonyms.length === 0) {
			return filteredList
				.map((i: any) => ({ word: i.content, phonetic: i.phonetic }))
				.sort(() => Math.random() - 0.5)
				.slice(0, 3);
		}
		let flag = true,
			count = 0;
		while (flag) {
			const resList = filteredList.sort(() => Math.random() - 0.5).slice(0, 3);
			let isOk = true;
			resList.forEach((i: any) => {
				if (synonyms.findIndex((w: any) => w === i.content) !== -1) isOk = false;
			});
			if (isOk) {
				flag = false;
				return resList.map((i: any) => ({ word: i.content, phonetic: i.phonetic }));
			}
			if (count > 100) {
				return [];
			}
			++count;
		}
	};

	const randomWordQuestionPack = (list: any[] = [], amount = 100) => {
		const n = amount < list.length ? amount : list.length;
		let result = [];
		const seedList = list.sort(() => Math.random() - 0.5).slice(0, n);
		let confusingList: AnalyserNode[] = list.slice(n + 1);
		const isEnough = confusingList.length > CONFUSING_LIST;

		for (let i = 0; i < n; ++i) {
			const { content, mean, phonetic, synonyms } = seedList[i];
			result.push({
				word: content,
				mean,
				phonetic,
				wrongList: isEnough
					? generateWrongWordList(content, synonyms, confusingList, true)
					: generateWrongWordList(content, synonyms, list, false)
			});
		}
		return result;
	};

	function shuffleAnswers(word: string, phonetic: string, wrongList: []) {
		let mergeList = [...wrongList, { word, phonetic }];
		return mergeList.sort(() => Math.random() - 0.5);
	}

	function addClassAnswerItem(
		status: number,
		answerIndex: number,
		index: number,
		word: string,
		answer: string
	) {
		if (status !== 0) {
			if (word === answer) return 'border-4 border-green-600';
			if (answerIndex === index) return 'border-4 border-red-600';
		}
		return '';
	}

	let isDone: boolean = false;
	let isSubscribe = true;

	onDestroy(() => {
		isSubscribe = false;
	});

	$: nQuestion = wordPack.length;

	let word = '',
		mean = '';

	$: if (wordPack.length) {
		word = wordPack[state.current].word;
		mean = wordPack[state.current].mean;
	}
	const nRightConsecutive = { current: { top: 0, n: 0 } };

	const onAnswer = (answer: string, answerIndex: number) => {
		if (answer === word) {
			HandlerSpeaker.playSoundAnswer(word, true);
			state = {
				...state,
				nRight: state.nRight + 1,
				status: 1,
				answerIndex
			};
			nRightConsecutive.current.n++;
		} else {
			HandlerSpeaker.playSoundAnswer(word, false);
			state = {
				...state,
				nWrong: state.nWrong + 1,
				status: 2,
				answerIndex
			};
			const { top, n } = nRightConsecutive.current;
			if (top < n) nRightConsecutive.current.top = n;
		}
		if (state.current !== wordPack.length - 1) {
			setTimeout(() => {
				const newAnswerList = shuffleAnswers(
					wordPack[state.current + 1]?.word,
					wordPack[state.current + 1]?.phonetic,
					wordPack[state.current + 1]?.wrongList
				);
				if (isSubscribe) {
					state = {
						...state,
						status: 0,
						answerIndex: -1,
						current: state.current + 1,
						answerList: newAnswerList
					};
				}
			}, DELAY_ANSWER);
		} else {
			setTimeout(() => {
				isSubscribe ? (isDone = true) : isDone;
			}, DELAY_ANSWER);
		}
	};

	const handleReplay = () => {
		isDone = false;
		state = {
			current: 0,
			nRight: 0,
			nWrong: 0,
			status: 0,
			answerList: shuffleAnswers(wordPack[0]?.word, wordPack[0]?.phonetic, wordPack[0]?.wrongList),
			answerIndex: -1
		};
		nRightConsecutive.current = { top: 0, n: 0 };
	};
</script>

<dialog bind:this={myModal4} id="" class="modal">
	<div class="modal-box max-w-3xl">
		<form>
			<h3 class="font-bold md:text-xl text-lg text-title mb-2">Lựa chọn gói từ vựng</h3>
			<div class="h-[1px] w-full border border-gray-200" />
			<div class="grid md:grid-cols-2 grid-cols-1 gap-2 mt-4">
				<div class="mb-3 form-control">
					<label for="types" class="block mb-2 text-sm">Loại từ </label>
					<select
						id="types"
						bind:value={selected.type}
						class="select select-bordered md:select-md select-sm border bg-gray-50 border-gray-300 focus:border-green-600 focus-visible:border-green-600 focus-within:outline-none text-sm rounded-lg block w-full max-w-sm"
					>
						<option class="block bg-base-200 md:text-base text-xs px-4 py-2" selected value={null}>
							Tất cả
						</option>
						{#each types as type (type.id)}
							{#if type.name !== 'Chưa xác định'}
								<option class="block bg-base-200 md:text-base text-xs px-4 py-2" value={type.id}>
									{type.name}
								</option>
							{/if}
						{/each}
					</select>
				</div>
				<div class="mb-3">
					<label for="level" class="block mb-2 text-sm">Bặc của từ </label>
					<select
						id="level"
						bind:value={selected.level}
						class="select select-bordered md:select-md select-sm border bg-gray-50 border-gray-300 focus:border-green-600 focus-visible:border-green-600 focus-within:outline-none text-sm rounded-lg block w-full max-w-sm"
					>
						<option class="block bg-base-200 md:text-base text-xs px-4 py-2" selected value={null}>
							Tất cả
						</option>
						{#each levels as level (level.id)}
							{#if level.name !== 'Chưa xác định'}
								<option class="block bg-base-200 md:text-base text-xs px-4 py-2" value={level.id}>
									{level.name}
								</option>
							{/if}
						{/each}
					</select>
				</div>

				<div class="mb-3">
					<label for="specialization" class="block mb-2 text-sm">Thuộc chuyên ngành </label>
					<select
						id="specialization"
						bind:value={selected.specialization}
						class="select select-bordered md:select-md select-sm border bg-gray-50 border-gray-300 focus:border-green-600 focus-visible:border-green-600 focus-within:outline-none text-sm rounded-lg block w-full max-w-sm"
					>
						<option class="block bg-base-200 md:text-base text-xs px-4 py-2" selected value={null}>
							Tất cả
						</option>
						{#if specializations.length}
							{#each specializations as specialization (specialization.id)}
								{#if specialization.name !== 'Chưa xác định'}
									<option
										class="block bg-base-200 md:text-base text-xs px-4 py-2"
										value={specialization.id}
									>
										{specialization.name}
									</option>
								{/if}
							{/each}
						{/if}
					</select>
				</div>

				<div class="form-control w-full max-w-sm mb-3">
					<div class="md:h-[28px]" />
					<button
						type="button"
						on:click={() => (showTopics = !showTopics)}
						class="input input-bordered md:input-md input-sm w-full max-w-sm flex justify-center items-center border bg-gray-50 border-gray-300 focus:border-green-600 focus-visible:border-green-600 focus-within:outline-none"
					>
						Thêm chủ đề
						<span class="ml-2">
							{#if showTopics}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="w-6 h-6"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M4.5 15.75l7.5-7.5 7.5 7.5"
									/>
								</svg>
							{:else}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="w-6 h-6"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M19.5 8.25l-7.5 7.5-7.5-7.5"
									/>
								</svg>
							{/if}
						</span>
					</button>
				</div>
				{#if showTopics}
					<div
						class="topics md:px-3 md:py-6 px-2 py-4 bg-base-200 flex flex-wrap rounded-md md:col-span-2 col-span-1"
					>
						{#each topics as topic, index (topic.name)}
							<button
								type="button"
								class="topic-item md:px-2 px-1 md:py-1 md:m-2 m-1 flex justify-between items-center w-fit rounded-full border-2 border-green-600 cursor-pointer"
								class:bg-green-500={topic.selected}
								class:text-white={topic.selected}
								on:click={() => toggleSelected(index)}
							>
								<img class="mr-1" src={imgTopics[topic.image]} alt={topic.name} />
								<span class="pr-1 text-sm">{topic.name}</span>
							</button>
						{/each}
					</div>
				{/if}
				<div class="form-control mb-3 col-span-1">
					<label class="label block md:btn-md btn-sm text-sm" for="number-sentence">
						<span class="label-text">Số câu</span>
					</label>
					<input
						type="number"
						class="input input-bordered md:input-md input-sm md:text-base text-sm focus:border-green-600 focus:outline-none"
						id="number-sentence"
						name="numberOfSentence"
						bind:value={selected.numSentence}
					/>
				</div>
			</div>
			<div class="h-[1px] w-full border border-gray-200" />
			<div class="modal-action">
				<form method="dialog">
					<a href="/practice">
						<button class="btn md:btn-md btn-sm">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-6 h-6 inline-block"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
								/>
							</svg>
							Quay lại
						</button>
					</a>
				</form>
				<button
					class="btn md:btn-md btn-sm btn-success ml-2 text-white"
					type="button"
					on:click={async () =>
						await getWordPack(
							selected.type,
							selected.level,
							selected.specialization,
							selected.topics,
							selected.numSentence
						)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-6 h-6 inline-block"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
						/>
					</svg>
					OK
				</button>
			</div>
		</form>
	</div>
</dialog>
{#if wordPack.length}
	<div class="flex flex-col justify-start items-center min-h-screen max-h-max">
		<div
			class="practice grid grid-flow-row max-w-screen-xl w-screen shadow-lg py-6 px-9 border mx-auto mt-10 grid-cols-1 rounded-lg"
		>
			<div class=" flex justify-start items-center">
				<img src={correctWord} alt={correctWord} class="h-[56px] w-[56px]" />
				<h1 class="md:text-2xl text-lg text-[#dd9210] font-bold">HÃY CHỌN TỪ ĐÚNG</h1>
			</div>
			{#if !isDone}
				<div class="flex justify-between items-center my-[14px] md:text-base text-sm">
					<div class="">
						Câu <b class="text-sky-600">{state.current + 1}</b>&nbsp;/&nbsp;<b class=""
							>{nQuestion}</b
						>
					</div>
					<div class="flex justify-center items-center font-thin">
						<b class="font-bold text-green-600">{state.nRight}&nbsp;</b>
						Đúng
						<RightIcon />
						-&nbsp;<b class="font-bold text-red-600">{state.nWrong}&nbsp;</b>Sai
						<WrongIcon />
					</div>
				</div>
				<div class="grid text-center grid-flow-row" class:disable={state.status !== 0}>
					<div class="flex flex-col justify-center items-center row-span-4">
						<p class="md:text-2xl text-lg font-bold text-slate-500 mb-1">{mean}</p>
						<div class="" class:visible={state.status !== 0} class:hidden={state.status === 0}>
							{#if state.status === 1}
								<p class="text-green-500 text-sm">Chính xác</p>
							{:else}
								<p class="text-red-500 text-sm">Sai rồi</p>
							{/if}
						</div>
					</div>
					<div
						class="grid grid-cols-2 grid-rows-2 md:gap-10 gap-2 w-full md:max-w-[50%] mx-auto my-0 py-6 row-span-6"
					>
						{#each state.answerList as answer, index (index)}
							<button
								type="button"
								disabled={state.status !== 0}
								class:disable={state.status !== 0}
								class:cursor-not-allowed={state.status !== 0}
								on:click={() => onAnswer(answer.word, index)}
								class={`${addClassAnswerItem(
									state.status,
									state.answerIndex,
									index,
									word,
									answer.word
								)}
								' bg-sky-400 rounded-md flex flex-col justify-center items-center p-[10px] hover:bg-sky-500 hover:cursor-pointer'`}
							>
								<p class="md:text-2xl text-base font-semibold text-white">{answer.word}</p>
								<span class="md:text-lg text-sm text-blue-800">{answer.phonetic}</span>
							</button>
						{/each}
					</div>
				</div>
			{:else}
				<div class="invisible" />
				<PracticeResult
					{data}
					words={words.map((word) => word.id)}
					{selected}
					onReplay={handleReplay}
					nRight={state.nRight}
					nWrong={state.nWrong}
					nRightConsecutive={nRightConsecutive.current.top}
				/>
			{/if}
		</div>
	</div>
{:else}
	<div class="h-screen w-full" />
{/if}
<ToastContainer placement="bottom-right" let:data>
	<FlatToast {data} />
</ToastContainer>

<style>
	.practice {
		grid-template-rows: 1fr 1fr 11fr;
	}
</style>
