import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Users, MessageSquare, Search, RefreshCw } from "lucide-react";
import { useCounselorDashboard } from "../hooks/useCounselorDashboard";

const StudentList = ({
  loading: externalLoading = false,
  onSendMessage,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [internalLoading, setInternalLoading] = useState(true);

  const { getStudentList } = useCounselorDashboard();

  const loadStudents = useCallback(async () => {
    try {
      setInternalLoading(true);
      const response = await getStudentList({ limit: 50 });
      setStudents(response.students || []);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setInternalLoading(false);
    }
  }, [getStudentList]);

  // Load students on component mount
  useEffect(() => {
    loadStudents();
  }, []);

  const loading = externalLoading || internalLoading;

  // Filter students based on search term
  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students;

    return students.filter(student =>
      `${student.firstName} ${student.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const handleSendMessage = (student) => {
    if (onSendMessage) {
      onSendMessage(student);
    }
  };

  return (
    <Card className="bg-white shadow-lg rounded-xl border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-gray-800 text-xl font-bold">
            <Users className="w-6 h-6 text-purple-600" />
            My Students ({students.length})
          </CardTitle>
          {/* {onRefresh && (
            <Button
              onClick={() => {
                loadStudents();
                if (onRefresh) onRefresh();
              }}
              disabled={loading}
              variant="outline"
              size="sm"
              className="bg-white shadow-sm border-purple-300 hover:border-purple-600 hover:shadow-md transition-all duration-300"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )} */}
        </div>

        {/* Search Bar */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border-gray-300 focus:border-purple-400 focus:ring-purple-400 rounded-lg"
          />
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="text-center py-10">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-10">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No students found</p>
            <p className="text-gray-400 text-sm">Students will appear here after booking appointments</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-10">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No students match your search</p>
            <p className="text-gray-400 text-sm">Try a different search term</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredStudents.map((student) => (
              <div
                key={student._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl shadow-sm bg-gradient-to-r from-white to-gray-50 hover:from-purple-50 hover:to-purple-100 transition-all duration-300 transform hover:scale-[1.01] hover:shadow-md"
              >
                <div className="flex items-center gap-4 flex-1">
                  <Avatar className="w-14 h-14 ring-2 ring-purple-100">
                    <AvatarImage src={student.profileImage} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700 font-semibold text-lg">
                      {student.firstName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-800 text-lg">
                        {student.firstName} {student.lastName}
                      </p>
                      {student.unreadCount > 0 && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                          {student.unreadCount} unread
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 font-medium">{student.email}</p>
                    {student.lastMessage && (
                      <p className="text-xs text-gray-500 mt-1 truncate max-w-md">
                        Last message: {student.lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105 ml-4"
                  onClick={() => handleSendMessage(student)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Search Results Summary */}
        {searchTerm && filteredStudents.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Showing {filteredStudents.length} of {students.length} students
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentList;