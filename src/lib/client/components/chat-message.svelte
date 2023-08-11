<script lang="ts">
  import { markdown } from '@client/services';
  import Mathrender from './Mathrender.svelte';
  import { Debug } from '@components';
  import { Role, type Message } from '@shared';
  import { Avatar } from '@skeletonlabs/skeleton';
  
  import MarkdownIt from "markdown-it";
  import { onMount, createEventDispatcher } from 'svelte'
 
  export let message: Message;
  export let index: number;
  export let deleteMessage: (index: number) => void;

  let showDetails = false;

  const mkd = MarkdownIt();

  // onMount(() => {
	// 	let script = document.createElement('script');
  //   script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js";
  //   document.head.append(script);
		
	// 	script.onload = () => {
  //     MathJax = {
  //       mml: { forceReparse: true } ,
  //       tex: {inlineMath: [['$', '$'], ['\\(', '\\)']]},
  //       svg: {fontCache: 'global'}
        
  //     };
	// 	};
	// 	console.log("chat message render")
	// });


//   function renderAfterMkd(){

//     renderMathInElement("msg");
//   }

//   beforeUpdate(() => {

// console.log('before');

// });

// afterUpdate(() => {
// console.log('after');

// });

//   onMount(() => {


//     console.log('onmount')
//   });

	
  // Function to render math after the content is updated/rendered
 
  // onMount(() => {

  // renderMathInElement("msg");

  // }
  // );
  
</script>



{#if message.role === Role.USER}
  <div class="card p-4 rounded-md space-y-2 variant-ghost-surface">
    <header class="flex justify-between items-center gap-3">
      <div class="flex gap-3 items-center">
        <Avatar src="https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg" width="w-8" />
        <p class="font-bold text-lg">You</p>
      </div>
      <button
        on:click={() => deleteMessage(index)}
        class="btn btn-icon btn-icon-sm text-surface-400"
        title="Delete message"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </header>
    <!-- <div class="message overflow-auto" id="usermsg">{'$' + message.content + '$'} -->
      <!-- {
        MathJax = {
          tex: {inlineMath: [['$', '$'], ['\\(', '\\)']]},
          svg: {fontCache: 'global'}
        }
        
      } -->
      <Mathrender message={'$' + message.content + '$'} id="usermsg"></Mathrender> 
    <!-- </div> -->
  </div>
{/if}

{#if message.role === Role.ASSISTANT && message.content}
  <div class="card p-4 rounded-md space-y-2 variant-soft-tertiary max-w-full">
    <header class="flex justify-between items-center">
      <div class="flex items-center gap-3">
        <Avatar src="src/lib/favicon.webp" width="w-8" />
        <p class="font-bold text-lg">MathBot</p>
        <small class="opacity-50">{message.durationMs} ms</small>
      </div>
      <button
        on:click={() => deleteMessage(index)}
        class="btn btn-icon btn-icon-sm text-surface-400"
        title="Delete message"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </header>
    <!-- <Mathrender message={message.content} id="msg"></Mathrender> -->
    <div class="message overflow-auto" id="msg">
      {@html markdown(message.content)}
      
      {console.log('markdown rendered')}
      
      {
        MathJax = {
          tex: {inlineMath: [['$', '$'], ['\\(', '\\)']]},
          svg: {fontCache: 'global'}
        }
        
      }
      {		console.log("chat message render")}
    </div>
  </div>
{/if}

<!-- {#if message.role === Role.ASSISTANT && message.function_call}
  <div class="card px-4 py-1 rounded-md space-y-2 variant-ringed-tertiary max-w-full">
    <header class="flex justify-between items-center">
      <div class="flex items-center gap-3">
        <Avatar src="src/lib/favicon.webp" width="w-6" />
        <p class="font-bold text-lg">Calling function...</p>
        <small class="opacity-50">{message.durationMs} ms</small>
      </div>
      <div class="flex items-center gap-2">
        <button
          on:click={() => (showDetails = !showDetails)}
          class="btn btn-sm text-surface-400"
          title="Show/hide details"
        >
          toggle
        </button>
        <button
          on:click={() => deleteMessage(index)}
          class="btn btn-icon btn-icon-sm text-surface-400"
          title="Delete message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </header>
    {#if showDetails}
      <div class="message overflow-auto">
        <Debug data={message.function_call} />
      </div>
    {/if}
  </div>
{/if} -->
<!-- 
{#if message.role === Role.FUNCTION}
  <div class="card px-4 py-1 rounded-md space-y-2 variant-ringed-tertiary max-w-full">
    <header class="flex justify-between items-center">
      <div class="flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <p class="font-bold text-lg">{message.name}</p>
        <small class="opacity-50">{message.durationMs} ms</small>
      </div>
      <div class="flex items-center gap-2">
        <button
          on:click={() => (showDetails = !showDetails)}
          class="btn btn-sm text-surface-400"
          title="Show/hide details"
        >
          toggle
        </button>
        <button
          on:click={() => deleteMessage(index)}
          class="btn btn-icon btn-icon-sm text-surface-400"
          title="Delete message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </header>
    {#if showDetails}
      <div class="message overflow-auto">
        {#if message.fnArgs}
          {@html markdown(
            `\`\`\`json 
${JSON.stringify(JSON.parse(message.fnArgs), null, 4)}
\`\`\``,
          )}
        {/if}
        {#if message.content}
          {@html markdown(
            `\`\`\`json 
${JSON.stringify(JSON.parse(message.content), null, 4)}
\`\`\``,
          )}
        {/if}
      </div>
    {/if}
  </div>
{/if}
 -->
