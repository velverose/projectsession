package com.assistant.service;

import com.assistant.dto.NoteDto;
import com.assistant.model.Note;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class NoteService {
    
    // In-Memory хранилище (по ТЗ)
    private final List<Note> notes = new ArrayList<>();
    private final AtomicLong counter = new AtomicLong(1);

    public List<Note> getAllNotes() {
        return new ArrayList<>(notes);
    }

    public Optional<Note> getNoteById(Long id) {
        return notes.stream().filter(note -> note.getId().equals(id)).findFirst();
    }

    public Note createNote(NoteDto noteDto) {
        Note newNote = new Note(counter.getAndIncrement(), noteDto.getTitle(), noteDto.getContent());
        notes.add(newNote);
        return newNote;
    }

    public Optional<Note> updateNote(Long id, NoteDto noteDto) {
        Optional<Note> existingNote = getNoteById(id);
        existingNote.ifPresent(note -> {
            note.setTitle(noteDto.getTitle());
            note.setContent(noteDto.getContent());
        });
        return existingNote;
    }

    public boolean deleteNote(Long id) {
        return notes.removeIf(note -> note.getId().equals(id));
    }
}
