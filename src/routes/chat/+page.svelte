
<script lang="ts">
  import ChatMessage from '@components/chat-message.svelte';
  import Debug from '@components/debug.svelte';
  import Loading from '@components/loading.svelte';
  import { AsyncOperationStatus, EntityOperationType, MessageSchema, type Message } from '@shared';
  import { Avatar } from '@skeletonlabs/skeleton';
  import { chats } from '@stores';
  import { onMount } from 'svelte';
  import { MathfieldElement, renderMathInDocument, renderMathInElement} from 'mathlive';
  import  Mathfield from '../../lib/client/components/Mathfield.svelte';
  import { math, display } from 'mathlifier';
  import { convertLatexToMarkup } from 'mathlive';

  let elemChat: HTMLElement;
  let currentMessage = '';



  // let mfe = new MathfieldElement();
  // onMount(() => {
	// 	let script = document.createElement('script');
  //   script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js";
  //   document.head.append(script);
		
	// 	script.onload = () => {
  //     MathJax = {
  //       tex: {inlineMath: [['$', '$'], ['\\(', '\\)']]},
  //       svg: {fontCache: 'global'}
  //     }
  //     ;
	// 	};
	// 	console.log("Mathjax rednered")
	// } );

  // document.body.appendChild(mfe);

onMount(() => {
  
  const mf = document.getElementById('mf');
    
      mf.addEventListener('input', (evt) => {

        document.getElementById('latex').value = mf.getValue();
        document.getElementById('latex').dispatchEvent(new Event('input'));
      });

       document.getElementById('latex').addEventListener('input', (ev) => {
        mf.setValue(ev.target.value);

       });
    }
);


  $: updateOperation = chats.getOperation($chats.chat.id, EntityOperationType.UPDATE);

  function scrollChatBottom(behavior?: ScrollBehavior): void {
    setTimeout(() => elemChat.scrollTo({ top: elemChat.scrollHeight, behavior }), 10);
  }

  function addMessage(): void {
    const content = currentMessage.trim();
    if (!content) {
      return;
    }
    const message = MessageSchema.parse({ content } satisfies Partial<Message>);
    chats.message({
      ...$chats.chat,
      messages: [...$chats.chat.messages, message],
    });
    currentMessage = '';
    scrollChatBottom('smooth');
  }

  function onPromptKeydown(event: KeyboardEvent): void {
    if (['Enter'].includes(event.code)) {
      event.preventDefault();
      addMessage();
    }
  }

  function deleteMessage(index: number): void {
    chats.update({
      ...$chats.chat,
      messages: $chats.chat.messages.filter((_, i) => i !== index),
    });
  }

  // When DOM mounted, scroll to bottom
  onMount(() => {
    scrollChatBottom();
    const unsubscribe = chats.onNewMessage($chats.chat.id, () => scrollChatBottom('smooth'));
    return unsubscribe;
  });
</script>


<section class="container mx-auto max-w-[800px] h-full pt-4">
  <div class="card chat w-full h-full grid grid-rows-[auto_75px]">
    <!-- #region Chat -->
    <section bind:this={elemChat} class="p-4 overflow-y-auto space-y-4 max-w-full">
      {#if $chats.chat.messages.length}
        {#each $chats.chat.messages as message, index}
          <ChatMessage {message} {index} {deleteMessage} />
        {/each}
      {:else}
        <div class="w-full h-full grid items-center">
          <div>
            <h3 class="h3 text-center opacity-50 mb-3">No messages yet.</h3>
            <p class="text-center opacity-50">Start a conversation using input below.</p>
          </div>
        </div>
      {/if}
      {#if updateOperation?.status === AsyncOperationStatus.IN_PROGRESS}
        <div class="flex items-center gap-3">
          <Avatar src="src/lib/favicon.webp" width="w-10" />
          <Loading size="h-5 w-5" />
        </div>
      {/if}

      {#if updateOperation?.status === AsyncOperationStatus.ERROR}
        <div class="alert variant-filled-warning">
          <Debug data={updateOperation?.error} />
        </div>
      {/if}
    </section>
    <!-- #endregion -->

    <!-- #region Prompt -->
    <section class="border-t border-surface-500/30 p-4">
      <div class="input-group input-group-divider grid-cols-[auto_80px] rounded-container-token">

       <math-field 
       id="mf"

       smart-mode=on
       
            style="
      font-size: 24px;
      padding: 8px;
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, .3);
      box-shadow: 0 0 8px rgba(0, 0, 0, .2);
      --caret-color: red;
      --selection-background-color: lightgoldenrodyellow;
      --selection-color: darkblue;
      min-width: 100px;
      "

       >
       

      </math-field>

       <textarea 
         bind:value={currentMessage}
          id="latex"
          name="prompt"
          rows="1"
          on:keydown={onPromptKeydown}
          class="output bg-transparent border-0 ring-0 min-h-[40px]"
          />

        
        <!--   bind:value={currentMessage}
          class="bg-transparent border-0 ring-0 min-h-[40px]"
          name="prompt"
          id="prompt"
          placeholder="Write a message..."
          rows="1"
          on:keydown={onPromptKeydown} -->
        <button
          class="text-center {currentMessage ? 'variant-filled-primary' : 'input-group-shim'}"
          on:click={addMessage}
        >
          Send
        </button>
      </div>
    </section>
    <!-- #endregion -->
  </div>
</section>

