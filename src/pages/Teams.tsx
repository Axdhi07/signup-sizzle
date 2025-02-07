
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Search } from "lucide-react";

type Team = Database["public"]["Tables"]["teams"]["Row"];

const Teams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from("teams")
        .select("*");

      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast({
        title: "Error",
        description: "Failed to load teams",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async () => {
    try {
      // First check if user has enough coins
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("coins")
        .single();

      if (profileError) throw profileError;

      if (!profile || profile.coins < 1000) {
        toast({
          title: "Insufficient Coins",
          description: "You need 1000 coins to create a team",
          variant: "destructive",
        });
        return;
      }

      // Create the team
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data: team, error: teamError } = await supabase
        .from("teams")
        .insert([
          {
            name: teamName,
            description: teamDescription,
            created_by: user.user.id,
          },
        ])
        .select()
        .single();

      if (teamError) throw teamError;

      // Add creator as team leader
      const { error: memberError } = await supabase
        .from("team_members")
        .insert([
          {
            team_id: team.id,
            user_id: user.user.id,
            role: "leader",
          },
        ]);

      if (memberError) throw memberError;

      // Deduct coins
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ coins: profile.coins - 1000 })
        .eq("id", user.user.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Team created successfully",
      });

      fetchTeams();
      setTeamName("");
      setTeamDescription("");
    } catch (error) {
      console.error("Error creating team:", error);
      toast({
        title: "Error",
        description: "Failed to create team",
        variant: "destructive",
      });
    }
  };

  const joinTeam = async (teamId: string) => {
    try {
      // Check if user has enough coins
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("coins")
        .single();

      if (profileError) throw profileError;

      if (!profile || profile.coins < 500) {
        toast({
          title: "Insufficient Coins",
          description: "You need 500 coins to join a team",
          variant: "destructive",
        });
        return;
      }

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      // Add user as team member
      const { error: memberError } = await supabase
        .from("team_members")
        .insert([
          {
            team_id: teamId,
            user_id: user.user.id,
            role: "member",
          },
        ]);

      if (memberError) throw memberError;

      // Deduct coins
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ coins: profile.coins - 500 })
        .eq("id", user.user.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Successfully joined the team",
      });

      fetchTeams();
    } catch (error) {
      console.error("Error joining team:", error);
      toast({
        title: "Error",
        description: "Failed to join team",
        variant: "destructive",
      });
    }
  };

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Teams</h1>
        <div className="flex gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create Team</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Team</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="team-name">Team Name</Label>
                  <Input
                    id="team-name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter team name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-description">Description</Label>
                  <Input
                    id="team-description"
                    value={teamDescription}
                    onChange={(e) => setTeamDescription(e.target.value)}
                    placeholder="Enter team description"
                  />
                </div>
                <Button onClick={createTeam} className="w-full">
                  Create Team (1000 coins)
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div>Loading teams...</div>
      ) : filteredTeams.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              No teams found.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTeams.map((team) => (
            <Card key={team.id}>
              <CardHeader>
                <CardTitle>{team.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {team.description || "No description"}
                </p>
                <Button onClick={() => joinTeam(team.id)} className="w-full">
                  Join Team (500 coins)
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Teams;
