import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { callSarvamTTS } from '../utils/sarvamClient';

const PodcastContext = createContext();

export const usePodcast = () => useContext(PodcastContext);

export const PodcastProvider = ({ children }) => {
    const [podcastScript, setPodcastScript] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentLineIndex, setCurrentLineIndex] = useState(-1);
    const [isLoadingAudio, setIsLoadingAudio] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [topicName, setTopicName] = useState('');
    const [ttsProgress, setTtsProgress] = useState('');

    const audioRef = useRef(null);
    const isPlayingRef = useRef(false);
    const playIdRef = useRef(0);
    const audioCache = useRef({});

    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    // Warn on tab close
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isPlayingRef.current || (audioRef.current && !audioRef.current.paused)) {
                e.preventDefault();
                e.returnValue = 'A podcast is currently playing. Are you sure you want to leave?';
                return e.returnValue;
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    const loadPodcast = (script, topic) => {
        setPodcastScript(script);
        setTopicName(topic);
        setCurrentLineIndex(-1);
        setIsFinished(false);
        setIsPlaying(false);
        setIsLoadingAudio(false);
        setTtsProgress('');
        playIdRef.current++;
        audioCache.current = {};
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
    };

    const fetchTTS = async (text, speaker) => {
        const key = `${speaker}_${text.substring(0, 50)}`;
        if (audioCache.current[key]) return audioCache.current[key];

        // Call Sarvam DIRECTLY from browser — no backend needed
        const audioUrl = await callSarvamTTS(text, { speaker: speaker.toLowerCase() });
        audioCache.current[key] = audioUrl;
        return audioUrl;
    };

    const prefetchNextLine = async (index, script) => {
        if (index < script.length) {
            const line = script[index];
            try {
                await fetchTTS(line.text, line.speaker);
            } catch (e) {
                // Ignore prefetch errors silently
            }
        }
    };

    const playLine = useCallback(async (index, scriptOverride = null) => {
        const script = scriptOverride || podcastScript;
        if (index >= script.length) {
            setIsFinished(true);
            setIsPlaying(false);
            setIsLoadingAudio(false);
            setTtsProgress('');
            return;
        }

        const currentPlayId = ++playIdRef.current;
        setCurrentLineIndex(index);
        setIsLoadingAudio(true);
        setIsPlaying(true);

        const line = script[index];
        setTtsProgress(`Generating voice for ${line.speaker} (${index + 1}/${script.length})...`);

        try {
            const audioUrl = await fetchTTS(line.text, line.speaker);

            if (!isPlayingRef.current || playIdRef.current !== currentPlayId) return;

            setIsLoadingAudio(false);
            setTtsProgress('');
            const audio = new Audio(audioUrl);
            
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.onended = null;
                audioRef.current.onerror = null;
            }
            audioRef.current = audio;

            audio.onended = () => {
                if (isPlayingRef.current && playIdRef.current === currentPlayId) {
                    playLine(index + 1, script);
                }
            };
            audio.onerror = () => {
                if (isPlayingRef.current && playIdRef.current === currentPlayId) {
                    setTimeout(() => playLine(index + 1, script), 300);
                }
            };
            
            await audio.play();
            
            // Background prefetch the next line to eliminate delay
            prefetchNextLine(index + 1, script);
            
        } catch (err) {
            console.error('[PodcastContext] TTS Error:', err);
            setIsLoadingAudio(false);
            setTtsProgress('');
            if (isPlayingRef.current && playIdRef.current === currentPlayId) {
                setTimeout(() => playLine(index + 1, script), 300);
            }
        }
    }, [podcastScript]);

    const togglePlay = () => {
        if (isPlaying) {
            setIsPlaying(false);
            playIdRef.current++;
            if (audioRef.current) {
                audioRef.current.pause();
            }
        } else {
            setIsPlaying(true);
            setIsFinished(false);
            if (audioRef.current?.paused && audioRef.current?.currentTime > 0) {
                audioRef.current.play();
            } else {
                playLine(currentLineIndex === -1 ? 0 : currentLineIndex, podcastScript);
            }
        }
    };

    const stopPodcast = () => {
        setIsPlaying(false);
        setIsLoadingAudio(false);
        setIsFinished(false);
        setCurrentLineIndex(-1);
        setTtsProgress('');
        playIdRef.current++;
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
    };

    const closePodcast = () => {
        stopPodcast();
        setPodcastScript([]);
        setTopicName('');
        audioCache.current = {};
    };

    const jumpToLine = (index) => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setCurrentLineIndex(index);
        if (isPlaying || !isPlayingRef.current) {
            setIsPlaying(true);
            playLine(index);
        }
    };

    const value = {
        podcastScript,
        topicName,
        isPlaying,
        currentLineIndex,
        isLoadingAudio,
        isFinished,
        ttsProgress,
        loadPodcast,
        togglePlay,
        stopPodcast,
        closePodcast,
        jumpToLine,
        hasPodcast: podcastScript.length > 0
    };

    return (
        <PodcastContext.Provider value={value}>
            {children}
        </PodcastContext.Provider>
    );
};
