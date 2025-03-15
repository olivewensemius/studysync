-- new user
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email)
  values (NEW.id, NEW.email);
  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure handle_new_user();