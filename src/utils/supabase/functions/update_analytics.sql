-- calculates the analytics

create or replace function update_study_analytics()
returns trigger as $$
begin
  update study_analytics
  set 
    total_study_time = total_study_time + NEW.duration,
    session_count = session_count + 1,
    last_session = NEW.created_at
  where user_id = NEW.user_id;
  return NEW;
end;
$$ language plpgsql;

create trigger study_session_created
after insert on study_sessions
for each row execute function update_study_analytics();