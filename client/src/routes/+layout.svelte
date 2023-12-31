<script lang="ts">
	import '../app.css';
	import default_image from '$lib/assets/images/default-image.png';
	import ctueLogo from '$lib/assets/images/ctue-high-resolution-logo-transparent3.png';
	import type { LayoutServerData } from './$types';
	import { onMount } from 'svelte';
	import { isLoading, audioSettings } from '$lib/store';
	import { goto } from '$app/navigation';

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
	import Speaker from '../components/Speaker.svelte';

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

	type Types = { id: number; name: string; isWord: boolean };
	type Levels = { id: number; name: string };
	type Specializations = { id: number; name: string };
	type Topics = { id: number; name: string; isWord: boolean; selected: boolean; image: string };

	export let data: LayoutServerData;

	let showNavBar = false;
	let userData: any = null;

	let voices: SpeechSynthesisVoice[];

	let indexVoice: number;
	let voiceValue: SpeechSynthesisVoice;
	let speedValue: number;
	let volumeValue: number;

	const unsubscribe = audioSettings.subscribe((value) => {
		speedValue = value.speed;
		volumeValue = value.volume;
		voiceValue = value.voice;
	});

	isLoading.set(true);

	const getSpeechSynthesis = () => {
		let synth: any;
		if (typeof window !== 'undefined') synth = window.speechSynthesis;
		let intervalId = setInterval(() => {
			if (synth.getVoices().length !== 0) {
				voices = synth.getVoices();
				voices = voices.filter((v) => v.lang == 'en-US' || v.lang == 'en-GB');
				voiceValue = voices[indexVoice];
				clearInterval(intervalId);
			}
		}, 50);
	};

	onMount(async () => {
		unsubscribe();
		getSpeechSynthesis();
		isLoading.set(false);
	});

	const updateAudioSettings = (
		newSpeed: number,
		newVolume: number,
		newVoice: SpeechSynthesisVoice
	) => {
		audioSettings.update((currentSettings) => ({
			...currentSettings,
			speed: newSpeed,
			volume: newVolume,
			voice: newVoice
		}));
	};

	$: {
		if (voices) {
			voiceValue = voices[indexVoice];
		}
		updateAudioSettings(speedValue, volumeValue, voiceValue);
	}

	let myModal4: HTMLDialogElement;

	export let showOnPx = 150;
	let hidden = true;

	function goTop() {
		document.body.scrollIntoView();
	}

	function scrollContainer() {
		return document.documentElement || document.body;
	}

	function handleOnScroll() {
		if (!scrollContainer()) {
			return;
		}
		if (scrollContainer().scrollTop > showOnPx) {
			hidden = false;
		} else {
			hidden = true;
		}
	}
	async function logout() {
		userData = null;
		goto('/');
		await fetch(`/`, {
			method: 'GET'
		});
	}

	$: if (data.user) {
		userData = data.user;
	}

	const debounce = (timer = null, cbFn: any, delay = 350) => {
		if (timer) {
			clearTimeout(timer);
		}
		return setTimeout(cbFn, delay);
	};
	let timer: any = null;
	let searchResult: any = [];
	function handleSearch(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		timer = debounce(
			timer,
			async function () {
				const key: string = event.target?.value;
				if (!Boolean(key)) {
					return;
				}
				searchResult = data.words.length
					? data.words.filter((word: any) => word.content.includes(key))
					: [];
			},
			350
		);
	}
	let wordDetails: any = null;
	let myModal5: HTMLDialogElement;
	const openModal = (word: any) => {
		wordDetails = word;
		myModal5.showModal();
	};
</script>

{#if $isLoading}
	<div class="w-full h-full flex justify-center items-center">
		<span class="loading loading-ring loading-lg" />
	</div>
{:else}
	<div class="box">
		<nav class=" bg-indigo-600 text-primary-content shadow-md row header">
			<div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3">
				<a href="/" class="flex items-center">
					<img src={ctueLogo} class="md:h-12 h-8 mr-3" alt="CTUe Logo" />
				</a>
				<div class="flex items-center">
					<div class="form-control">
						<div class="dropdown">
							<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
							<label tabindex="0" class="m-1">
								<input
									type="text"
									placeholder="Tìm kiếm..."
									on:input={handleSearch}
									class="input input-bordered md:input-md input-sm w-36 md:w-auto md:py-0 py-4 md:my-0 mt-0 mr-2 text-slate-600 input-search"
								/>
							</label>
							<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
							<ul
								tabindex="0"
								class:block={searchResult?.length}
								class:hidden={searchResult?.length === 0}
								class="dropdown-content z-[1] menu p-2 w-full md:max-w-md max-w-sm shadow bg-base-100 rounded-box mt-2 text-slate-600"
							>
								{#each searchResult as word (word.id)}
									<li class="">
										<button class="block" type="button" on:click={() => openModal(word)}>
											<p class="md:text-base text-sm text-green-600">
												{word.content}&nbsp;<span class="text-xs text-blue-600">
													/{word.phonetic}/
												</span>
											</p>
											<p class="text-xs">{word.mean}</p>
										</button>
									</li>
								{/each}
							</ul>
						</div>
					</div>
					{#if userData}
						<div class="relative md:w-12 md:h-12 h-10 w-10 avatar-user z-10 group cursor-pointer">
							{#if userData.User.avt}
								<img
									class="h-full w-full rounded-full border-2 border-sky-400"
									src={userData.User.avt}
									alt={userData.User.avt}
								/>
							{:else}
								<img
									class="h-full w-full rounded-full border-2 border-sky-400"
									src={default_image}
									alt={default_image}
								/>
							{/if}
							<ul
								class="absolute w-[300px] text-slate-700 shadow-lg bg-[#fcfcfc] sub-avatar-user hidden rounded-sm group-hover:opacity-100 opacity-75 right-0 top-full scale-90 hover:scale-100 origin-top transition-all duration-200"
							>
								<a href="/profile">
									<li class=" py-3 px-4 flex hover:bg-[#e5e5e5]">
										<span class="inline-block">
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
													d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
												/>
											</svg>
										</span>
										<span class="ml-2">Thông tin cá nhân</span>
									</li>
								</a>
								{#if userData.accountType === 'admin'}
									<a href="/manage-account">
										<li class=" py-3 px-4 flex hover:bg-[#e5e5e5]">
											<span class="inline-block">
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
														d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
													/>
												</svg>
											</span>
											<span class="ml-2">Quản lý người dùng</span>
										</li>
									</a>
									<a href="/manage-contribution">
										<li class=" py-3 px-4 flex hover:bg-[#e5e5e5]">
											<span class="inline-block">
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
														d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z"
													/>
												</svg>
											</span>
											<span class="ml-2">Quản lý đóng góp</span>
										</li>
									</a>
									<a href="/manage-word">
										<li class=" py-3 px-4 flex hover:bg-[#e5e5e5]">
											<span class="inline-block">
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
														d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
													/>
												</svg>
											</span>
											<span class="ml-2">Quản lý từ vựng</span>
										</li>
									</a>
									<a href="/manage-sentence">
										<li class=" py-3 px-4 flex hover:bg-[#e5e5e5]">
											<span class="inline-block">
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
														d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
													/>
												</svg>
											</span>
											<span class="ml-2">Quản lý câu</span>
										</li>
									</a>
									<a href="/manage-irregular-verb">
										<li class=" py-3 px-4 flex hover:bg-[#e5e5e5]">
											<span class="inline-block">
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
														d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
													/>
												</svg>
											</span>
											<span class="ml-2">Quản lý động từ bất quy tắt</span>
										</li>
									</a>
								{/if}
								<button class="w-full" on:click={() => myModal4.showModal()}>
									<li class=" py-3 px-4 flex hover:bg-[#e5e5e5]">
										<span class="inline-block"
											><svg
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
													d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
												/>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
												/>
											</svg>
										</span>
										<span class="ml-2">Cài đặt</span>
									</li></button
								>
								<a href="/">
									<li class=" py-3 px-4 flex hover:bg-[#e5e5e5]">
										<span class="inline-block"
											><svg
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
													d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
												/>
											</svg>
										</span>
										<span class="ml-2">Liên hệ - Giúp đỡ</span>
									</li>
								</a>
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<li class=" py-3 px-4 flex hover:bg-[#e5e5e5]" on:click={logout}>
									<span class="inline-block">
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
												d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
											/>
										</svg>
									</span>
									<button class="ml-2" type="submit">Đăng xuất</button>
								</li>
							</ul>
						</div>
					{:else}
						<a href="/login">
							<button
								type="button"
								class="md:btn-md btn-sm text-white border border-white bg-transparent leading-6 focus:ring-4 outline-none focus:outline-none focus:ring-blue-300 font-medium rounded-lg md:text-sm text-xs text-center md:mr-3 mr-0"
							>
								Đăng nhập
							</button>
						</a>
					{/if}
				</div>
			</div>
		</nav>
		<slot class="row content " />
		<div class="row footer group fixed bottom-0 right-0 p-2 flex items-end justify-end w-24 h-24">
			<div
				class="text-white shadow-xl flex items-center justify-center p-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 z-50 absolute"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6 group-hover:rotate-90 transition-all duration-[0.6s]"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
					/>
				</svg>
			</div>
			<a
				href="/"
				class=" absolute rounded-full transition-all duration-[0.2s] ease-out scale-y-0 group-hover:scale-y-100 group-hover:-translate-x-16 flex p-2 hover:p-3 bg-green-300 scale-100 hover:bg-green-400 text-white"
			>
				<div class="">
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
							d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
						/>
					</svg>
				</div>
			</a>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				on:click={goTop}
				class="absolute rounded-full transition-all duration-[0.2s] ease-out scale-x-0 group-hover:scale-x-100 group-hover:-translate-y-16 flex p-2 hover:p-3 bg-blue-300 hover:bg-blue-400 text-white"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-6 h-6"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
				</svg>
			</div>
			<button
				on:click={() => myModal4.showModal()}
				class="absolute rounded-full transition-all duration-[0.2s] ease-out scale-x-0 group-hover:scale-x-100 group-hover:-translate-y-14 group-hover:-translate-x-14 flex p-2 hover:p-3 bg-yellow-300 hover:bg-yellow-400 text-white"
			>
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
						d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
					/>
				</svg>
			</button>
		</div>
	</div>
	<dialog bind:this={myModal4} id="my_modal_4" class="modal">
		<div class="modal-box w-11/12 max-w-5xl md:p-6 px-3">
			<h3 class="font-bold md:text-2xl text-xl text-orange-600 mb-2">Cài đặt</h3>
			<div class="h-[1px] w-full border border-gray-200" />
			<div class="md:px-6 md:py-3">
				<div class="border rounded-md my-4 p-4">
					<h1 class="md:text-lg text-base mb-3">Giọng Đọc</h1>
					<div class="grid md:grid-cols-3 grid-cols-1 gap-7">
						<div class="col-span-1 flex flex-col">
							<p class="text-light text-slate-500 my-2 md:text-base text-sm">Giọng</p>
							<select
								class="border md:select-md select-sm border-slate-500 select w-full max-w-xs"
								bind:value={indexVoice}
							>
								{#if voices}
									{#each voices as voice, i}
										<option value={i}>{voice.name}</option>
									{/each}
								{/if}
							</select>
						</div>
						<div class="col-span-1 flex flex-col">
							<p class="text-light text-slate-500 my-2 md:text-base text-sm">Âm lượng</p>
							<div class="h-auto flex justify-between items-center grow shrink-0">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="w-6 h-6 grow-0"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
									/>
								</svg>
								<input
									type="range"
									min="0"
									max="100"
									class="range mx-3 range-xs range-primary"
									bind:value={volumeValue}
								/>
								<p class="grow">{volumeValue}</p>
							</div>
						</div>
						<div class="col-span-1 flex flex-col">
							<p class="text-light text-slate-500 my-2 md:text-base text-sm">Tốc độ đọc</p>
							<div class="h-auto flex justify-between items-center grow shrink-0">
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
										d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
									/>
								</svg>
								<input
									type="range"
									min="0.5"
									max="1.5"
									step="0.5"
									class="range mx-3 range-xs range-primary"
									bind:value={speedValue}
								/>
								<p class="grow">{speedValue}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="h-[1px] w-full border border-gray-200" />
			<div class="modal-action">
				<form method="dialog">
					<button class="btn md:btn-md btn-sm bg-green-600 hover:bg-green-700 text-white">
						Đồng ý
					</button>
				</form>
			</div>
		</div>
	</dialog>
{/if}

<footer class="footer footer-center md:p-10 p-4 bg-indigo-500 text-primary-content">
	<aside>
		<a href="/" class="flex items-center">
			<img src={ctueLogo} class="h-8 mr-3" alt="CTUe Logo" />
		</a>
		<p class="font-bold">
			CTUe Industries Ltd. <br />Providing reliable tech since 1992
		</p>
		<p>Copyright © 2023 - All right reserved</p>
	</aside>
	<nav>
		<div class="grid grid-flow-col gap-4">
			<a href="/">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					class="fill-current"
				>
					<path
						d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
					/>
				</svg>
			</a>
			<a href="/">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					class="fill-current"
				>
					<path
						d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"
					/>
				</svg>
			</a>
			<a href="/">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					class="fill-current"
				>
					<path
						d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"
					/>
				</svg>
			</a>
		</div>
	</nav>
</footer>
<svelte:window on:scroll={handleOnScroll} />
<dialog bind:this={myModal5} id="my_modal_3" class="modal">
	{#if wordDetails}
		<div class="modal-box no-scrollbar md:text-base text-sm">
			<form method="dialog">
				<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-xl">✕</button>
			</form>
			<h3 class="font-bold md:text-2xl text-lg text-title mb-2">
				Chi Tiết Từ "{wordDetails.content}"
			</h3>
			<div class="h-[1px] w-full border border-gray-200" />
			<div class="flex my-4">
				<img
					src={wordDetails.picture}
					alt={wordDetails.picture}
					class="md:h-[50px] h-10 md:w-[50px] w-10 inline-block"
				/>
				<div class="inline-block ml-4">
					<div class="flex justify-center items-center">
						<p class="mr-2 text-green-600 md:text-xl text-base font-semibold">
							{wordDetails.content}
						</p>
						<span class="mr-2 text-blue-600">
							{wordDetails.phonetic ? '/' + wordDetails.phonetic + '/' : ''}
						</span>
						<Speaker key={wordDetails.content} />
					</div>
					<p>{wordDetails.mean}</p>
				</div>
			</div>
			<p class="font-bold">
				Loại từ:
				<span class="font-normal">
					{wordDetails?.Type ? wordDetails.Type.name : ''}
				</span>
			</p>
			<p class="font-bold">
				Cấp độ:
				<span class="font-normal">
					{wordDetails?.Level ? wordDetails.Level.name : ''}
				</span>
			</p>
			<p class="font-bold">Câu ví dụ:</p>
			<ol>
				{#if wordDetails?.examples?.length}
					{#each wordDetails.examples as example, i}
						{#if example !== ''}
							<li class="indent-2"><span class="font-semibold">{i + 1}</span>. {example}</li>
						{/if}
					{/each}
				{/if}
			</ol>
			<p class="font-bold">
				Thuộc chuyên ngành:
				<span class="font-normal">
					{wordDetails.Specialization ? wordDetails?.Specialization.name : ''}
				</span>
			</p>
			<p class="font-bold">Chủ đề:</p>
			<div class="p-2 flex flex-wrap rounded-md">
				{#if wordDetails.Topic}
					{#each wordDetails.Topic as topic}
						<div
							class="topic-item px-2 py-1 m-1 flex justify-between items-center w-fit rounded-full border-2 border-teal-500"
						>
							<img class="mr-1" src={imgTopics[topic.image]} alt={topic.name} />
							<span class="pr-1 text-sm">{topic.name}</span>
						</div>
					{/each}
				{/if}
			</div>
			<p class="font-bold">Các từ đồng nghĩa:</p>
			<ol>
				{#if wordDetails?.synonyms}
					{#each wordDetails?.synonyms as synonym, i}
						{#if synonym !== ''}
							<li class="indent-2"><span class="font-semibold">{i + 1}</span>. {synonym}</li>
						{/if}
					{/each}
				{/if}
			</ol>
			<p class="font-bold">Các từ trái nghĩa:</p>
			<ol>
				{#if wordDetails?.antonyms}
					{#each wordDetails?.antonyms as antonym, i}
						{#if antonym !== ''}
							<li class="indent-2"><span class="font-semibold">{i + 1}</span>. {antonym}</li>
						{/if}
					{/each}
				{/if}
			</ol>
			<p class="font-bold">Ghi chú:</p>
			<p>{wordDetails.note ? wordDetails.note : ''}</p>
		</div>
	{/if}
</dialog>

<style>
	.box {
		display: flex;
		flex-flow: column;
	}

	.box .row.header {
		flex: 0 1 auto;
	}

	.box .row.content {
		flex: 1 1 auto;
	}

	.box .row.footer {
		flex: 0 1 40px;
	}

	.avatar-user:hover .sub-avatar-user {
		display: block;
	}
</style>
